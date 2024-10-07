import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  discordId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const discordUser = mongoose.model("discordUser", discordUserSchema);
