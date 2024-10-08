import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

// Takes the validated user and stores it into session data
passport.serializeUser((user, done) => {
  // console.log("Inside Serialize User Function");
  // console.log(user);
  done(null, user.id);
});

// Registers a function used to deserialize user objects out of the session.
passport.deserializeUser(async (id, done) => {
  // console.log("Inside Deserialize User Function");
  // console.log(`Deserializing user with Id: ${id}`);
  try {
    const findUser = await User.findById(id); // Search for user

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
  new Strategy({ usernameField: "name" }, async (name, password, done) => {
    try {
      const findUser = await User.findOne({ name });
      // console.log(findUser);

      // If user is not present
      if (!findUser) {
        throw new Error("User Not Found!");
      }

      // if the password is not equal to the hashed password in databse
      if (!comparePassword(password, findUser.password)) {
        throw new Error("Invalid Password!");
      }

      done(null, findUser);
    } catch (err) {
      // Send the error
      done(err, null);
    }
  })
);
