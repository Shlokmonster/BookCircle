import mongoose from "mongoose";

const db_connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.mongo_url || 'mongodb://localhost:27017/bookcircle');
        console.log("connected to db successfully");
    } catch (error) {
        console.log("error connecting to db - ", error);
        process.exit(1);
    }
}
export default db_connect;