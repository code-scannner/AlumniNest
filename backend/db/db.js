import { connect } from 'mongoose';

const mongoURI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        await connect("mongodb+srv://221210099:codescannner@alumninest.36oq5.mongodb.net/AlumniNest");
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
    }
};

export default connectDB;