import { Strategy as LocalStrategy } from "passport-local";
import User from "../../modules/User/User.model";

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    console.log("Authenticating user:", email); // Debugging line

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found:", email); // Debugging line
        return done(null, false, { message: "Incorrect email or password." });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log("Password mismatch for user:", email); // Debugging line
        return done(null, false, { message: "Incorrect email or password." });
      }

      console.log("User authenticated successfully:", user); // Debugging line
      return done(null, user);
    } catch (error) {
      console.error("Error during authentication:", error); // Debugging line
      return done(error);
    }
  }
);

export default localStrategy;
