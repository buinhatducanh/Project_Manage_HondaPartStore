const express = require("express");
const router = express.Router();
const Review = require("../models/Review.js");

// CREATE: Thêm đánh giá mới
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Lấy tất cả đánh giá của một sản phẩm
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
