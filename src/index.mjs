// Importing express
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com}" },
  { id: 3, name: "Bob Smith", email: "bob@example.com" },
];

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/api/users", (req, res) => {
  res.send(mockUsers);
});

app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { // Invalid Id number was sent
    res.status(400).send({ message: "Invalid id" });
  } else {
    const user = mockUsers.find((user) => user.id === id);
    if (!user) { // User Not found in the database
      res.status(404).send({ message: "User not found" });
    } else { 
      res.send(user);
    }
  }
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "Chicken Breast", price: 10.99 },
    { id: 2, name: "Dildo", price: 9.99 },
    { id: 3, name: "Viagra", price: 12.99 },
  ]);
});

// Creating a new express app instance
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
