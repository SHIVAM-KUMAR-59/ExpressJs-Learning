import express from "express"; // Importing express
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./Stratergies/local-stratergy.mjs";
// import "./Stratergies/discord-stratergy.mjs";

export function createApp() {
  const app = express();

  app.use(express.json()); // Middleware to parse JSON body
  app.use(cookieParser("HelloWorld")); // Parsing cookies
  app.use(
    // Using sessions
    session({
      secret: "shivam",
      saveUninitialized: false, // Save uninitialized sessions to the store
      resave: false, // Resave unmodified sessions back to the store
      cookie: {
        maxAge: 60000 * 60, // 1 hour, after this the cookie will expire
      },
      // Store the session Info
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );

  app.use(passport.initialize()); // Using passport.js library
  app.use(passport.session());

  app.use(routes); // Using all the routes

  // Authenticate user route
  app.post("/api/auth", passport.authenticate("local"), (req, res) => {
    return res.sendStatus(200);
  });

  // Get the authentication status of user route
  app.get("/api/auth/status", (req, res) => {
    // console.log("Inside /api/auth/status endpoint");
    // console.log(req.user);
    // console.log(req.session);
    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    } else {
      req.logout((err) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });

  // Get Requests for home
  app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("Hello", "World", { maxAge: 30000, signed: true });
    res.status(200).send({ msg: "Hello World" });
  });

  // CLIENT_SECRET = gxQxl6XDvh7BUshUI9AG7s49KpGk0Z1G
  // CLIENT_ID = 1292854304180277359
  app.get("/api/auth/discord", passport.authenticate("discord"));
  app.get(
    "/api/auth/discord/redirect",
    passport.authenticate("discord"),
    (req, res) => {
      console.log(req.session);
      console.log(req.user);
      res.sendStatus(200);
    }
  );

  return app;
}
