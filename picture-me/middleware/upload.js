const multer = require("multer");

// Guardar el archivo en memoria RAM temporalmente (req.file.buffer)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Si no es un formato válido, se rechaza sin guardarlo
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5 MB por imagen
  },
});

module.exports = upload;