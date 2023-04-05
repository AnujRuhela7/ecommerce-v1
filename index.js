if (process.env.NODE_ENV != "prodcution") require("dotenv").config();

const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Varaibles
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/shopping-app";
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || "this is a secret session";

// Connect to DB
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const sessionflash = {
  secret: sessionSecret,
  resave: false,
  saveUnitiailized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionflash));
app.use(flash());
app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Product Routes
const productRouter = require("./routes/productRoutes");
// Review Routes
const reviewRouter = require("./routes/reviewRoutes");
// Auth Routes
const authRouter = require("./routes/authRoutes");

mongoose.set("strictQuery", true);

// Middlewares
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// Routers
app.use(productRouter);
app.use(reviewRouter);
app.use(authRouter);

// app.get("/products", (req, res) => {
//   res.render("./products/product");
// });

app.listen(port, () => {
  console.log("Server is running successfully at port: " + port);
});

// Username - anujruhela07

// Password - shoppingcart07
