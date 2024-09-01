// Importing express
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Creating a new express app instance
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
