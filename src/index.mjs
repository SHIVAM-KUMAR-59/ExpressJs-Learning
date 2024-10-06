import express from "express"; // Importing express
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(routes); // Using all the routes

const PORT = process.env.PORT || 3000; // Declaring the port

// Get Requests for home
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello World" });
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
