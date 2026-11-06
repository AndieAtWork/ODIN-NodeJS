const cloudinaryPrivate = require("cloudinary").v2;

cloudinaryPrivate.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinaryPrivate = (buffer, folder = "posts") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryPrivate.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        type: "authenticated"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

module.exports = {
  cloudinaryPrivate,
  uploadToCloudinaryPrivate,
};