import Campground from "../models/campground.js";
import Review from "../models/review.js";

const deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review has been deleted Successfully.");
  res.redirect(`/campground/${id}`);
};

const addReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "New Review Created Successfully.");
  res.redirect(`/campground/${req.params.id}`);
};

export default { deleteReview, addReview };
