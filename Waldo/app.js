const express = require("express");
const indexRouter = require("./routes/router");
const path = require("node:path");

const app = express();

//Cuando use res.render(), quiero utilizar EJS para generar las vistas.
//Todas las vistas a las que haga referencia parten aqui.
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
// middleware de Express.
// dice que procese los datos enviados por formularios HTML y los convierta en un objeto accesible desde req.body
// esta aqui porque es middleware de aplicacion: afecta a toda comunicacion

app.use(express.json());

app.use("/", indexRouter); // indexRouter parte desde el root (va a recibir todo)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});