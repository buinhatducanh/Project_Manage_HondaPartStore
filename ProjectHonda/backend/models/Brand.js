const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true  // Đảm bảo mỗi phân loại là duy nhất
  },
  description: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);
