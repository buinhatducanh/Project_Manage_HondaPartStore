const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình storage cho Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async (req, file) => "png", // Lưu ảnh dưới dạng PNG
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Đặt tên file
  },
});

const upload = multer({ storage });

console.log("Cloudinary connected:", cloudinary.config().cloud_name); // Kiểm tra kết nối

module.exports = upload;
