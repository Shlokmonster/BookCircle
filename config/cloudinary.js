import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const cloudVal = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

if (!cloudVal.cloud_name || !cloudVal.api_key || !cloudVal.api_secret) {
  console.error("❌ Cloudinary config missing! Check your .env file.");
  console.error("Current values keys present:", Object.keys(cloudVal).filter(k => !!cloudVal[k]));
}

cloudinary.config(cloudVal);

export default cloudinary;
