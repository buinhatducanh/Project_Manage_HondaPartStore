const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(201).json({ 
      message: "Ảnh tải lên thành công!", 
      imageUrl: req.file.path, // Đường dẫn ảnh trên Cloudinary
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
    