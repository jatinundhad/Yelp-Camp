import mongoose from "mongoose";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";

//importing model into the app
import Campground from "../models/campground.js";

// connecting with thw database
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
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

const randomTitle = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({}); // delete whole data of the database

  for (let i = 0; i < 50; i++) {
    let randomCity = cities[Math.floor(Math.random() * 1000)];
    let price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${randomCity.city}, ${randomCity.state}`,
      title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
      price: price,
      author: "635bbc3faa1506d29e865387",
      images: [
        {
          url: "https://res.cloudinary.com/dgwxnofll/image/upload/v1673183046/YelpCamp/cappvji14cjeybcqzhe1.jpg",
          name: "YelpCamp/n6l2jgjxuctlaqxessxm",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magni suscipit maiores totam culpa pariatur, sint quis iure quisquam, vel quos. Maxime veniam incidunt hic eos harum, provident assumenda magni.",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
