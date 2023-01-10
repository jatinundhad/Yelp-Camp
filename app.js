import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
const app = express();
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
// import LocalStrategy from "passport-local";
import User from "./models/user.js";
import mongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

// connecting with thw database
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected with database");
  })
  .catch((err) => {
    console.log("Error while connecting with database");
    console.log(("Errror >> ", err));
  });

app.set("view engine", "ejs");
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: "true" }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(mongoSanitize());

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret: "thisshouldbeagoodlogic",
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR >> ", e);
});

const Secret = process.env.SECRET || "thisshouldbeagoodlogic";

// creating the session
const sessionConfig = {
  store,
  name: "session",
  secret: Secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// home page route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

//user routes
import userRoutes from "./routes/user.js";
app.use("/", userRoutes);

// campground's routes
import campgroudRoutes from "./routes/campground.js";
app.use("/", campgroudRoutes);

// review's route
import reviewRoute from "./routes/review.js";
app.use("/", reviewRoute);

// show the page not found message for not existing route
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// will render the error (error middleware)
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!!!";
  res.status(statusCode).render("error", { err });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Hi i am hearing here at port 3000 ${port}`);
});
