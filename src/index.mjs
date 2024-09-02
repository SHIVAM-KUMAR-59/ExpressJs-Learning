// Importing express
import express from "express";

const app = express();

app.use(express.json()); // Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
  { id: 3, name: "Bob Smith", email: "bob@example.com" },
  { id: 4, name: "Dwayne Smith", email: "dwayne@example.com" },
  { id: 5, name: "Jane Smith", email: "jane@example.com" },
  { id: 6, name: "John Smith", email: "john@example.com" },
  { id: 7, name: "Jane Smith", email: "jane@example.com" },
];

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Query Params
// Get the usernames starting with a particular letter(s)
app.get("/api/users", (req, res) => {
  const { filter, value } = req.query;

  // Check if no query parameters are provided
  if (!filter && !value) {
    return res.send(mockUsers);
  }

  // Check if both filter and value are provided
  if (filter && value) {
    const filteredUsers = mockUsers.filter((user) => {
      if (user[filter] && typeof user[filter] === "string") {
        return user[filter].includes(value);
      }
      return false;
    });
    if (filteredUsers.length > 0) {
      return res.send(filteredUsers);
    } else {
      return res.status(404).send({ message: "No matching users found" });
    }
  }

  // Default response
  return res.send(mockUsers);
});

// Post Requests
// Create a new user
app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

// Request Params
// Get a user by ID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    // Invalid Id number was sent
    return res.status(400).send({ message: "Invalid id" });
  } else {
    const user = mockUsers.find((user) => user.id === id);
    if (!user) {
      // User Not found in the database
      return res.status(404).send({ message: "User not found" });
    } else {
      return res.send(user);
    }
  }
});

// Products endpoint with product names
app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "Tablets", price: 799.99 },
    { id: 2, name: "Laptop", price: 999.99 },
    { id: 3, name: "Smartphone", price: 699.99 },
  ]);
});

// Creating a new express app instance
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
