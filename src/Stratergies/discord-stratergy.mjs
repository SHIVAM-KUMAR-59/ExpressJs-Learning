import passport from "passport";
import Strategy from "passport-discord";
import { discordUser } from "../mongoose/schemas/discordUser.mjs";

// Takes the validated user and stores it into session data
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User Function");
  console.log(user);
  done(null, user.id);
});

// Registers a function used to deserialize user objects out of the session.
passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize User Function");
  console.log(`Deserializing user with Id: ${id}`);
  try {
    const findUser = await discordUser.findById(id); // Search for user

    if (!findUser) {
      // Not found then throw error
      throw new Error("User Not Found");
    }

    done(null, findUser); // Found then send the user
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: "1292854304180277359",
      clientSecret: "gxQxl6XDvh7BUshUI9AG7s49KpGk0Z1G",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await discordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new discordUser({
            name: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }

        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
