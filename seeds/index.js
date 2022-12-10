const mongoose = require('mongoose');
const cities = require("./cities")
const { places, descriptors } = require('./seedHelpers');
const Campground = require("../models/campground.js");


// Mongoose connection
mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true, useUnifiedTopology: true, });


const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61456b1b8fe2e74c7880fff8",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam minus dignissimos accusantium ad deleniti, porro voluptatem eos, aliquam quibusdam, totam omnis alias ea nam quam!",
            price,
            geometry: {
                type:"Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/depqhhbgu/image/upload/v1632031415/YelpCamp/iuvndhqjbljqo31isdm2.jpg',
                    filename: 'YelpCamp/iuvndhqjbljqo31isdm2',
                  },
                  {
                    url: 'https://res.cloudinary.com/depqhhbgu/image/upload/v1632031420/YelpCamp/sj2rimmorark5kdt91ca.jpg',
                    filename: 'YelpCamp/sj2rimmorark5kdt91ca',
                  },
                  {
                    url: 'https://res.cloudinary.com/depqhhbgu/image/upload/v1632031424/YelpCamp/fvpaqzmoonh3nb4wati0.jpg',
                    filename: 'YelpCamp/fvpaqzmoonh3nb4wati0',
                  }
            ]
        });
        await camp.save();
    }
}

seedDb().then(() =>{
    mongoose.connection.close();
})