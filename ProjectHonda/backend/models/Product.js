const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true }, // Mã sản phẩm
    name: { type: String, required: true },
    brand: { 
      type: mongoose.Schema.Types.ObjectId, // Chỉ lưu 1 ID của hãng
      ref: "Brand", 
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId, // Lưu danh sách ID của category
        ref: "Category", 
        required: true,
      },
    ],
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    description: { type: String },
    image: { 
      // Mảng chứa các đối tượng với thông tin url và public_id của Cloudinary
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true }
        }
      ],
      default: [
        {
          url: "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739377337/empty_cpvono.jpg",
          public_id: "empty_cpvono"
        }
      ] 
    },
    additionalInfo: {
      weight: { type: Number, default: 0 }, // Trọng lượng (g)
      length: { type: Number, default: 0 }, // Chiều dài (mm)
      width: { type: Number, default: 0 }, // Chiều rộng (mm)
      height: { type: Number, default: 0 }, // Chiều cao (mm)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
