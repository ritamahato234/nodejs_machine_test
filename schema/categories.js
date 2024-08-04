const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true }
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("category", categoriesSchema);

