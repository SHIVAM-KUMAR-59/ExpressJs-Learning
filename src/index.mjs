import express from "express"; // Importing express
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(cookieParser("HelloWorld")); // Parsing cookies
app.use(
  session({
    secret: "shivam",
    saveUninitialized: false, // Save uninitialized sessions to the store
    resave: false, // Resave unmodified sessions back to the store
    cookie: {
      maxAge: 60000 * 60, // 1 hour, after this the cookie will expire
    },
  })
); // Using sessions
app.use(routes); // Using all the routes

const PORT = process.env.PORT || 3000; // Declaring the port

// Get Requests for home
app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("Hello", "World", { maxAge: 30000, signed: true });
  res.status(200).send({ msg: "Hello World" });
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
