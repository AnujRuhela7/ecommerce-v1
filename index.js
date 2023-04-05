if (process.env.NODE_ENV != "prodcution") require("dotenv").config();

const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");

const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const authRouter = require("./routes/authRoutes");

// Varaibles
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/shopping-app";
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || "this is a secret session";
const app = express();
const methodOverride = require("method-override");
// Connect to DB
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

mongoose.set("strictQuery", true);
// const PORT = 3000;
const sessionflash = {
  secret: sessionSecret,
  resave: false,
  saveUnitiailized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(express.static("public"));
app.use(session(sessionflash));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  req.locals.success = req.flash("success");
  req.locals.error = req.flash("error");
  req.locals.currentUser = req.user;
  next();
});

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use(productRouter);
app.use(reviewRouter);
app.use(authRouter);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/products", (req, res) => {
//   res.render("./products/product");
// });

app.listen(port, () => {
  console.log("Server is running successfully at port: " + port);
});

// Username - anujruhela07

// Password - shoppingcart07
