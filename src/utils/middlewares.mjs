import { users } from "./constants.mjs";

// Middleware to reduce redundancy of code in put, patch and delete methods
export const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parseId = parseInt(id);
  if (isNaN(parseId)) {
    // Invalid Id Case
    return res.status(400).send({ msg: "Invalid id" });
  }

  const findUserIndex = users.findIndex((user) => user.id === parseId);

  if (findUserIndex === -1) {
    // User Not Found Case
    return res.status(404).send({ msg: "User not found" });
  }
  req.findUserIndex = findUserIndex;
  next();
};
