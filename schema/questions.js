const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }]
  
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("question", questionsSchema);

