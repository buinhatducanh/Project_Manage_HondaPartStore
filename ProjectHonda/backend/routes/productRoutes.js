const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");
const upload = require("../middleware/upload");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// POST: Tạo sản phẩm mới
router.post("/", upload.array("image", 5), async (req, res) => {
  try {
    console.log("Dữ liệu nhận từ Client:", req.body);
    console.log("Files upload:", req.files);

    // Kiểm tra dữ liệu bắt buộc
    if (!req.body.name || !req.body.price || !req.body.code) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết!" });
    }

    // Xử lý ảnh: chuyển từ req.files thành mảng đối tượng { url, public_id }
    const imageObjs =
      req.files && req.files.length > 0
        ? req.files.map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [
            {
              url: "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739377337/empty_cpvono.jpg",
              public_id: "empty_cpvono",
            },
          ];

    // Parse JSON cho các trường object
    let parsedCategories = [];
    try {
      parsedCategories = req.body.categories ? JSON.parse(req.body.categories) : [];
    } catch (e) {
      return res.status(400).json({ message: "Dữ liệu categories không hợp lệ!" });
    }

    let parsedAdditionalInfo = {};
    try {
      parsedAdditionalInfo = req.body.additionalInfo ? JSON.parse(req.body.additionalInfo) : {};
    } catch (e) {
      return res.status(400).json({ message: "Dữ liệu additionalInfo không hợp lệ!" });
    }

    // Chuyển đổi brand thành ObjectId nếu có và hợp lệ
    let brandId = null;
    if (req.body.brand && mongoose.Types.ObjectId.isValid(req.body.brand)) {
      brandId = new mongoose.Types.ObjectId(req.body.brand);
    }

    const newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      code: req.body.code,
      brand: brandId, // Sử dụng ObjectId đã kiểm tra
      categories: parsedCategories.map((id) => new mongoose.Types.ObjectId(id)),
      description: req.body.description,
      image: imageObjs,
      additionalInfo: {
        weight: Number(parsedAdditionalInfo.weight || 0),
        length: Number(parsedAdditionalInfo.length || 0),
        width: Number(parsedAdditionalInfo.width || 0),
        height: Number(parsedAdditionalInfo.height || 0),
      },
    });

    console.log("Dữ liệu sẽ lưu:", newProduct);

    const product = await newProduct.save();
    res.status(201).json({ message: "Sản phẩm đã được tạo!", product });
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// READ: Lấy tất cả sản phẩm (CÓ POPULATE)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name") // Lấy tên thương hiệu
      .populate("categories", "name"); // Lấy tên danh mục

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Cập nhật sản phẩm
router.put("/:id", upload.array("image", 5), async (req, res) => {
  try {
    console.log("📥 Dữ liệu gửi lên từ Client:", req.body);
    console.log("📸 Ảnh mới upload:", req.files);

    const { brand, categories, additionalInfo, existingImages, ...otherData } = req.body;

    // Xử lý ảnh mới: chuyển sang đối tượng {url, public_id}
    const newImages =
      req.files && req.files.length > 0
        ? req.files.map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [];

    // existingImages từ FE phải được gửi theo đúng định dạng đối tượng
    const oldImages = existingImages
      ? Array.isArray(existingImages)
        ? existingImages
        : [existingImages]
      : [];

    const finalImages = [...oldImages, ...newImages].filter(Boolean);

    // Parse JSON cho categories và additionalInfo
    let parsedCategories = [];
    try {
      parsedCategories = categories ? JSON.parse(categories) : [];
    } catch (e) {
      return res.status(400).json({ message: "Dữ liệu categories không hợp lệ!" });
    }

    let parsedAdditionalInfo = {};
    try {
      parsedAdditionalInfo = additionalInfo ? JSON.parse(additionalInfo) : {};
    } catch (e) {
      return res.status(400).json({ message: "Dữ liệu additionalInfo không hợp lệ!" });
    }

    // Chuyển đổi brand nếu hợp lệ
    let brandId = null;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      brandId = new mongoose.Types.ObjectId(brand);
    }

    const updatedData = {
      ...otherData,
      brand: brandId,
      categories: parsedCategories.map((id) => new mongoose.Types.ObjectId(id)),
      image: finalImages,
      additionalInfo: parsedAdditionalInfo,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    )
      .populate("brand")
      .populate("categories");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    console.log("✅ Dữ liệu sau cập nhật:", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("❌ Lỗi cập nhật sản phẩm:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Xóa sản phẩm và ảnh trên Cloudinary
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Xoá ảnh trên Cloudinary: sử dụng public_id đã lưu
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      for (const imageObj of product.image) {
        try {
          await cloudinary.uploader.destroy(imageObj.public_id);
        } catch (cloudinaryError) {
          console.warn("Lỗi xoá ảnh trên Cloudinary:", cloudinaryError.message);
        }
      }
    }

    // Xoá sản phẩm khỏi MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Xóa sản phẩm thành công (bao gồm ảnh nếu có)!" });
  } catch (err) {
    console.error("Lỗi xoá sản phẩm:", err);
    res.status(400).json({ message: "Không thể xoá sản phẩm!" });
  }
});

// Upload ảnh và cập nhật đường dẫn vào MongoDB (nếu cần)
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Upload successful",
      imageUrl: req.file.path, // URL ảnh trên Cloudinary
      public_id: req.file.filename, // Public ID của ảnh
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand")
      .populate("categories");

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: "ID không hợp lệ hoặc lỗi server!" });
  }
});

module.exports = router;
