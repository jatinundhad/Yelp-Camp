import express from "express";
import passport from "passport";
const router = express.Router();
import AsyncCatch from "../utils/AsyncCatch.js";
import users from "../controller/user.js";

router
  .route("/register")
  .get(users.registerForm)
  .post(AsyncCatch(users.registerUser));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.checkLoginAndEnter
  );

router.get("/logout", users.logout);

export default router;
