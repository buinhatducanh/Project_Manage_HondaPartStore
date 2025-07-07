const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },  // Trường này là ObjectId liên kết với collection User
  
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },  // Trường này là ObjectId liên kết với collection Product
      quantity: { 
        type: Number, 
        required: true 
      },  // Số lượng của sản phẩm trong đơn hàng
    }
  ],
  
  totalAmount: { 
    type: Number, 
    required: true 
  },  // Tổng giá trị đơn hàng
  
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered'], 
    default: 'pending' 
  },  // Trạng thái đơn hàng (pending, shipped, delivered)
}, { timestamps: true });  // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Order", orderSchema);
