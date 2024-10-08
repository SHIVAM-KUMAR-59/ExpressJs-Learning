import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

mongoose // Connect to the databse
  .connect("mongodb://localhost:27017/express_learning")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const app = createApp();

const PORT = process.env.PORT || 3000; // Declaring the port

// Listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
