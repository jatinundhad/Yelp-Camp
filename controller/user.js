import User from "../models/user.js";

const registerForm = (req, res) => {
  res.render("users/register.ejs");
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registered_user = await User.register(user, password);
    req.login(registered_user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to the Camp Grounds.");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

const loginForm = (req, res) => {
  res.render("users/login.ejs");
};

const checkLoginAndEnter = (req, res) => {
  req.flash("success", "Welcome Back!!!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Good Bye!!!");
    res.redirect("/campgrounds");
  });
};

export default {
  registerForm,
  registerUser,
  loginForm,
  checkLoginAndEnter,
  logout,
};
