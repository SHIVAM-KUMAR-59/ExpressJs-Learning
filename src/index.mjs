import express from "express"; // Importing express

const app = express();

app.use(express.json()); // Middleware to parse JSON body

// Example middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

// Middleware to reduce redundancy of code in put, patch and delete methods
const resolveUserById = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parseId = parseInt(id);
  if (isNaN(parseId)) {
    // Invalid Id Case
    return res.status(400).send({ msg: "Invalid id" });
  }

  const findUserIndex = users.findIndex((user) => user.id === parseId);

  if (findUserIndex === -1) {
    // User Not Found Case
    return res.status(404).send({ msg: "User not found" });
  }
  req.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000; // Declaring the port

// Users array
const users = [
  { id: 1, name: "Shivam", email: "shivam@gmail.com" },
  { id: 2, name: "Rohan", email: "rohan@gmail.com" },
  { id: 3, name: "Hardik", email: "hardik@gmail.com" },
  { id: 4, name: "Pihu", email: "pihu@gmail.com" },
  { id: 5, name: "Ritu", email: "rituu@gmail.com" },
  { id: 6, name: "Lihu", email: "lihu@gmail.com" },
];

// Products array
const products = [
  { id: 1, name: "Tissue", price: 10.99 },
  { id: 2, name: "Dress", price: 19.99 },
  { id: 3, name: "Shirt", price: 29.99 },
];

// Get Requests for home
app.get(
  "/",
  (req, res, next) => {
    console.log("Base URL 1");
    next();
  },
  (req, res, next) => {
    console.log("Base URL 2");
    next();
  },
  loggingMiddleware,
  (req, res) => {
    res.status(200).send({ msg: "Hello World" });
  }
);

// Get Request and Query Params for /api/users route (Shows All Users or Filtered Users)
app.get("/api/users", (req, res) => {
  const { filter, value } = req.query;

  // Send filtered users when both filter and value are present
  if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
  }

  // Send all users otherwise
  return res.status(200).send(users);
});

// This middleware will not function for any routes writter before or above it, it will only function for the routes written after it
// app.use(loggingMiddleware, (req, res, next) => {
//     console.log("Finished Logging");
//     next();
// });

// Post Request to add a new user ( without validation )
app.post("/api/users", (req, res) => {
  const newUser = {
    id: users[users.length - 1].id + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  res.status(201).send(newUser);
});

// Route Parameters for users (Shows a specific user by id)
app.get("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  const user = users[findUserIndex];
  if (!user) {
    return res.status(404).send({ msg: "User not found" });
  }

  res.status(200).send(user);
});

// Get Requests for /api/products route (Shows All Products)
app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});

// Put Request to update the entire user, it changes all the properties of the user sent in the request body
app.put("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

// Patch Request to update a part of user which is sent in the requst body
app.patch("/api/users/:id", (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return res.sendStatus(200);
});

// Delete Request to delete any user
app.delete("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;
  // Delete the user from the array
  users.splice(findUserIndex);
  return res.sendStatus(200);
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
