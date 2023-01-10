import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { cloudinary } from "../cloudinary/index.js";

const index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

const showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Campground does not found.");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show.ejs", {
    campground,
  });
};

const newCampgroundForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

const addCampgrounds = async (req, res, next) => {
  const newCampground = new Campground({
    ...req.body.campground,
    author: req.user._id,
  });
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    name: f.filename,
  }));

  const campground = await newCampground.save();
  console.log(campground);
  req.flash("success", "Campground Created Successfully.");
  res.redirect(`/campground/${campground._id}`);
};

const campgroundEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground does not found.");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

const updateCampground = async (req, res, next) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });

  const images = req.files.map((f) => ({
    url: f.path,
    name: f.filename,
  }));

  campground.images.push(...images);
  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.update({
      $pull: { images: { name: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Campground Edited Successfully.");
  res.redirect(`/campground/${id}`);
};

const deleteCampground = async (req, res, next) => {
  const { id } = req.params;

  const camp = await Campground.findOneAndDelete({ _id: id });
  const { reviews } = camp;
  await Review.deleteMany({ _id: { $in: reviews } });
  req.flash("success", `Campground - "${camp.title}" has been deleted.`);
  res.redirect("/campgrounds");
};

export default {
  index,
  showCampground,
  newCampgroundForm,
  addCampgrounds,
  campgroundEditForm,
  updateCampground,
  deleteCampground,
};
