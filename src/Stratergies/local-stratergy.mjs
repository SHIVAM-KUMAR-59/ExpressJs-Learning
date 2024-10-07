import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/constants.mjs";

// Takes the validated user and stores it into session data
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User Function");
  console.log(user);
  done(null, user.id);
});

// Registers a function used to deserialize user objects out of the session.
passport.deserializeUser((id, done) => {
  console.log("Inside Deserialize User Function");
  console.log(`Deserializing user with Id: ${id}`);
  try {
    const findUser = users.find((user) => user.id === id); // Search for user

    if (!findUser) {
      // Not found then throw error
      throw new Error("User Not Found");
    }

    done(null, findUser); // Found then send the user
  } catch (error) {
    done(error, null);
  }
});

// Main validation function
export default passport.use(
  new Strategy({ usernameField: "name" }, (username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
      const findUser = users.find((user) => user.name === username);
      // User not found
      if (!findUser) {
        throw new Error("User Not Found");
      }
      // User found but password does not match
      if (findUser.password !== password) {
        throw new Error("Invalid Credentials");
      }
      // User validated then send it
      done(null, findUser);
    } catch (err) {
      // Send the error
      done(err, null);
    }
  })
);
