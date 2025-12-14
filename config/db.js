import mongoose from "mongoose";

const db_connect = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log("connected to db successfully");
    } catch (error) {
        console.log("error connecting to db - ", error);
        process.exit(1);
    }
}
export default db_connect ;