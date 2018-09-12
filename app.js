const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/database");

// MongoDB Config
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("MongoBD Connected...."))
  .catch(err => console.log(err));

// Handlebars Config
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method Override Config
app.use(methodOverride("_method"));

// Express Session Config
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Conncet Flash Config
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//-- ROUTES --//
// INDEX Route
app.get("/", (req, res) => {
  res.render("index");
});

// ABOUT Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

// Server Config
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
