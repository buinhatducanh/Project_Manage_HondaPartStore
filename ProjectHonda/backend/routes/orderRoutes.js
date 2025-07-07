const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");

// CREATE: Tạo đơn hàng mới
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Lấy tất cả đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
