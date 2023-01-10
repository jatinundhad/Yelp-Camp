import express from "express";
const router = express.Router();
import AsyncCatch from "../utils/AsyncCatch.js";
import { isLoggedIn, validateCampground, isAuthor } from "../middlewares.js";
import campgrounds from "../controller/campground.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage });

router
  .route("/campgrounds")
  .get(AsyncCatch(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    AsyncCatch(campgrounds.addCampgrounds)
  );

router.get("/campground/:id", AsyncCatch(campgrounds.showCampground));

router.get("/campgrounds/new", isLoggedIn, campgrounds.newCampgroundForm);

router.get(
  "/campground/:id/edit",
  isLoggedIn,
  isAuthor,
  AsyncCatch(campgrounds.campgroundEditForm)
);

router
  .route("/campground/:id")
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    AsyncCatch(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, AsyncCatch(campgrounds.deleteCampground));

export default router;
