import { users } from "../utils/constants.mjs";
import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (req, res) => {
  const { findUserIndex } = req;
  const user = users[findUserIndex];
  if (!user) {
    return res.sendStatus(404);
  }

  return res.send(user);
};

export const createUserHandler = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // If there are errors, return the errors
    return res.status(400).send(result.array());
  }

  const data = matchedData(req); // Extracts validated data from the request body
  data.password = hashPassword(data.password); // Hash the password
  const newUser = new User(data); // Create a User instance

  try {
    const savedUser = await newUser.save(); // Save the user in the database
    return res.status(201).send(savedUser);
  } catch (error) {
    return res.sendStatus(400);
  }
};
