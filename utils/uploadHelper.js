import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadToCloudinary = async (fileOrString) => {
    if (!fileOrString) return null;

    // If it's a string (URL or base64)
    if (typeof fileOrString === 'string') {
        // If it's already a cloudinary URL, return it
        if (fileOrString.includes('cloudinary.com')) return fileOrString;

        // If it's a base64 string or another URL
        try {
            const result = await cloudinary.uploader.upload(fileOrString);
            return result.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error (string):", error);
            throw new Error('Image upload failed');
        }
    }

    // If it's a buffer (from multer)
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    console.error("Cloudinary upload error (stream):", error);
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(fileOrString.buffer).pipe(uploadStream);
    });
};
