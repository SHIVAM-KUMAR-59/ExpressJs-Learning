import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  email: mongoose.Schema.Types.String,
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
