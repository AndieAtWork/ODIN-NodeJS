// Libraries and framework
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");

const passport = require("./passport-config");

const app = express();

// Routers
const indexRouter = require("./routes/indexRouter");
const blogRouter = require("./routes/blogRouter");

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Where to get the views from, using ejs engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MIDDLEWARES
// Este middleware crea y administra sesiones HTTP.
app.use(session({ 
    secret: process.env.SESSION_SECRET, //Es una clave utilizada por express-session para firmar la cookie de sesion.
    resave: false, // No guardes nuevamente la sesion si no fue modificada.
    saveUninitialized: false // No guardes una sesion que todavia no ha sido utilizada/modificada.
    // No quieres crear sesiones para absolutamente todos los visitantes que simplemente entran a tu pagina.
}));

// Passport middleware pasa a los demas requests que se realicen
app.use(passport.initialize());
app.use(passport.session());

// Middleware para pasar currentUser a todas las vistas EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.loginError = req.session.messages?.pop() || null;
  next();
});

// Middleware da forma al req.body
app.use(express.urlencoded({ extended: true }));

// Applying Routers
app.use("/", indexRouter);
app.use("/blog/", blogRouter);

// Deploy
const PORT = process.env.PORT;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});