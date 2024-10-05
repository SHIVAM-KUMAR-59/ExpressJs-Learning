import express from "express"; // Importing express

const app = express();
const PORT = process.env.PORT || 3000; // Declaring the port

// Users array
const users = [
  {
    id: 1,
    name: "Shivam",
    email: "shivam@gmail.com",
  },
  {
    id: 2,
    name: "Rohan",
    email: "rohan@gmail.com",
  },
  {
    id: 3,
    name: "Hardik",
    email: "hardik@gmail.com",
  },
  {
    id: 4,
    name: "Pihu",
    email: "pihu@gmail.com",
  },
  {
    id: 5,
    name: "Ritu",
    email: "rituu@gmail.com",
  },
  {
    id: 6,
    name: "Lihu",
    email: "lihu@gmail.com",
  },
];

// Products array
const products = [
  {
    id: 1,
    name: "Tissue",
    price: 10.99,
  },
  {
    id: 2,
    name: "Dress",
    price: 19.99,
  },
  {
    id: 3,
    name: "Shirt",
    price: 29.99,
  },
];

// Get Requests for home
app.get("/", (req, res) => {
  //   res.status(200).send("Hello World"); --> Sending a String
  res.status(200).send({ msg: "Hello World" });
});

// Get Request and Query Params for /api/users route ( Shows All Users or Filtered Users )
app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;

// When both filter and value is present, send filtered users
if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
}

// When only filter is present or even filter is not present, send all users
return res.status(200).send(users);
});

// Get Requests for /api/products route ( Shows All Producsr )
app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});

// Route Parameters for users ( Shows users with the requested parameters )
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const parseId = parseInt(id);
  if (isNaN(parseId)) {
    res.status(400).send({ msg: "Invalid id" });
  }

  const user = users.find((user) => user.id === parseId);

  if (!user) {
    return res.status(404).send({ msg: "User not found" });
  } else {
    res.status(200).send(user);
  }
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
