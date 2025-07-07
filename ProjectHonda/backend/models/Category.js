const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true  // Đảm bảo mỗi phân loại là duy nhất
  },
  description: { 
    type: String 
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,  // Trường này liên kết với phân loại cha
    ref: "Category",  // Liên kết với chính collection Category
    default: null  // Nếu không có phân loại cha, trường này sẽ là null
  }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
