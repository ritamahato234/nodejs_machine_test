const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionsSchema = new Schema(
  {
    text: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }]
  
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("question", questionsSchema);

