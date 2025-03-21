const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
    }
};

module.exports = connectDB;