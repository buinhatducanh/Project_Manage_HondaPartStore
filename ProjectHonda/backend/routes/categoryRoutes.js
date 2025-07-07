  const express = require("express");
  const router = express.Router();
  const Category = require("../models/Category");

  // CREATE: Thêm mới category
  router.post("/", async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // READ: Lấy tất cả categories
  router.get("/", async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // UPDATE: Cập nhật thông tin category
  router.put("/:id", async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE: Xóa category
  router.delete("/:id", async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;
