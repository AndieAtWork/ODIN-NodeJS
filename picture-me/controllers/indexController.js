const bcrypt = require("bcryptjs");
const passport = require("../passport-config");

const { body, validationResult, matchedData } = require("express-validator");
const pool = require("../db");

const validateUser = [
    body("username")
        .trim()
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Your username may only contain letters, numbers, underscores, and hyphens.")
        .isLength({ min: 3, max: 15 })
        .withMessage(`Your username must be between 3 and 15 characters long.`),

    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Your password must be between 8 and 20 characters long."),

    body("passwordConfirm")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
          }
          return true; // La validacion pasa si son identicos
        })
        .withMessage("Password confirmation does not match password")
];

exports.loginGet = (req, res) => {
  if (res.locals && res.locals.currentUser){
    res.render("welcome", {});
  }else{
    const errors = req.session.messages || [];
    req.session.messages = [];
    res.render("login", {});
  }
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/welcome", 
  failureRedirect: "/",
  failureMessage: true
});

exports.signUpGet = (req, res) => {
  if (res.locals && res.locals.currentUser){
    res.render("welcome", {});
  }else{
    res.render("sign-up", {});
  }
};

exports.signUpPost = [
  ...validateUser,
  async (req, res, next) => {

    const errors = validationResult(req); 
    const usuarioRepetido = await validationUserResult(req.body.username)
    if (!errors.isEmpty() || usuarioRepetido) {
      let erroresArray = errors.array();
      if (usuarioRepetido){
        erroresArray.push({
          "msg": "Username already registered."
        })
      }
      return res.status(400).render("sign-up", {
        errors: erroresArray,
        formData: req.body
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // RETURNING * para obtener el usuario recien insertado con su id
      const { rows } = await pool.query(
        "INSERT INTO blog_user (username, password) VALUES ($1, $2) RETURNING *", 
        [
          req.body.username,
          hashedPassword
        ]
      );
      
      const newUser = rows[0];

      // Inicia la sesión en Passport directamente con el objeto del nuevo usuario
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/welcome");
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
];

async function validationUserResult(username) {
  const { rows } = await pool.query(
    "SELECT 1 FROM blog_user WHERE LOWER(username) = $1 LIMIT 1",
    [username.toLowerCase()]
  );
  return rows.length > 0;
}

exports.portadaGet = (req, res) => {
  if (res.locals && res.locals.currentUser){
    res.render("welcome", {});
  }else{
    res.render("login", {});
  }
}

exports.logoutPost = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.render("login", {});
  });
};