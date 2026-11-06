const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("./db");

passport.use(
  new LocalStrategy(
    async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM blog_user WHERE LOWER(username) = $1",
          [username.toLowerCase()]
        );
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: "Username not yet registered." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM blog_user WHERE user_id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});


module.exports = passport;