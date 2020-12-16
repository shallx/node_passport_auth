const express = require("express");
const chalk = require("chalk");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { log } = require("console");
const flash = require("connect-flash");
const session = require("express-session");

// Environment Variables
require("dotenv").config();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const db_link = process.env.MONGO_URI;
const secret_session_key = process.env.SESSION_KEY || "secret";

// Mongodb connect
mongoose
  .connect(db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => log("MongoDb Connected!!!"))
  .catch(err => log(err));

// Static paths
app.use(express.static(path.join(__dirname, "public")));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: secret_session_key,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// Connect Flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Routes
require("./routes").routes(app);

app.listen(port, host, () => {
  console.log(
    chalk.black.bgCyanBright(
      " Server is listening to:",
      chalk.underline(`http://${host}:${port} `)
    )
  );
});