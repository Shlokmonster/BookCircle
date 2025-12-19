import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    avatar: {
        type: String, // URL from Cloudinary
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    joinedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
