const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");

// CREATE: Thêm mới Brand
router.post("/", async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Lấy tất cả Brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE: Cập nhật thông tin Brand
router.put("/:id", async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(updatedBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Xóa Brand
router.delete("/:id", async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
