import express from "express"; // Importing express
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(cookieParser("HelloWorld")); // Parsing cookies
app.use(routes); // Using all the routes

const PORT = process.env.PORT || 3000; // Declaring the port

// Get Requests for home
app.get("/", (req, res) => {
  res.cookie("Hello", "World", { maxAge: 30000, signed: true });
  res.status(200).send({ msg: "Hello World" });
});

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
