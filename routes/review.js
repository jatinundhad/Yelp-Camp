import express from "express";
const router = express.Router();
import AsyncCatch from "../utils/AsyncCatch.js";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middlewares.js";
import reviews from "../controller/review.js";

router.delete(
  "/campground/:id/review/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  AsyncCatch(reviews.deleteReview)
);

router.post(
  "/campground/:id/review",
  isLoggedIn,
  validateReview,
  AsyncCatch(reviews.addReview)
);

export default router;
