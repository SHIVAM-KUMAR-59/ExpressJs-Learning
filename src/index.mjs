import express from "express"; // Importing express
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { users } from "./utils/constants.mjs";

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

// Path to authenticate user
app.post("/api/auth", (req, res) => {
  // Assuming the payload is correct
  const {
    body: { name, password },
  } = req;

  const findUser = users.find((user) => user.name === name);

  // User Not Found
  if (!findUser) {
    return res.status(401).send({ msg: "User Not Found" });
  }

  // Incorrect Password
  if (findUser.password !== password) {
    return res.status(401).send({ msg: "Incorrect Password" });
  }

  req.session.user = findUser; // Mapping the user to the session
  return res.status(200).send(findUser);
});

// Get the authentication status of the user
app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionId, (err, session) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(session);
    }
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

// Route to add item to the cart
app.post("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ msg: "Unauthorized" });
  }

  const { body: item } = req;
  const { cart } = req.session;
  if (cart) {
    // Cart is defined, push the item into it
    cart.push(item);
  } else {
    // Cart is not defined, then define it
    req.session.cart = [item];
  }

  return res.status(201).send(item);
});

// Get items from the cart
app.get("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ msg: "Unauthorized" });
  }

  return res.send(req.session.cart ?? []);
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
