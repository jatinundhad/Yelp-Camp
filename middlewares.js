import { campgroundSchema } from "./utils/ExpressValidate.js";
import { reviewSchema } from "./utils/ExpressValidate.js";
import Campground from "./models/campground.js";
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/review.js";

export const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((e) => e.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must required login");
    return res.redirect("/login");
  }
  next();
};

export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((e) => e.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have a persmission to do that.");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have a persmission to do that.");
    return res.redirect(`/campground/${id}`);
  }
  next();
};
