import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { users } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

// Get Request to get all users or filtered users validated using body() function from express-validator
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    const {
      query: { filter, value },
    } = req;

    // Send filtered users when both filter and value are present
    if (filter && value) {
      return res.send(users.filter((user) => user[filter].includes(value)));
    }

    // Send all users otherwise
    return res.status(200).send(users);
  }
);

// Route Parameters for users (Shows a specific user by id)
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const user = users[findUserIndex];
  if (!user) {
    return res.status(404).send({ msg: "User not found" });
  }

  res.status(200).send(user);
});

// Post Request to add a new user validated using body() function from express-validator
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      // If there are errors, return the errors
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req); // Extracts validated data from the request body
    const newUser = { id: users[users.length - 1].id + 1, ...data };
    users.push(newUser);
    res.status(201).send(newUser);
  }
);

// Put Request to update the entire user, it changes all the properties of the user sent in the request body
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

// Patch Request to update a part of user which is sent in the requst body
router.patch("/api/users/:id", (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return res.sendStatus(200);
});

// Delete Request to delete any user
router.delete("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;
  // Delete the user from the array
  users.splice(findUserIndex);
  return res.sendStatus(200);
});

export default router;
