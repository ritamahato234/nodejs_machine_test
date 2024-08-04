const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Create userSchema
var userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token:{ type: String},
    profilePicture: { type: String,default:"" }
     
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user = this;
  console.log("ismodified:", user.isModified("password"));
  if (!user.isModified("password")) return next();

  const saltRounds = 10;
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// Export your module
module.exports = mongoose.model("user", userSchema);

