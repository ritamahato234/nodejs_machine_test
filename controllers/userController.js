const UserSchema = require("../schema/users")
const commonService = require("../helper/commonService")
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
          throw "Email id are required"
        }
        if (!password) {
          throw "Password is required"
        }
        const user = await UserSchema.findOne({ email });
        if (!user) {
          throw 'User is not found';

        }
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
          throw 'Invalid credentials';

        }
        const accessToken = await commonService.createUserAccessToken({
          _id: user._id,
          email: user.email,
        });
        // console.log("accessToken==>", accessToken);
        const tokenData = { id: user._id, token: accessToken };
    
        user.token =accessToken;
        await user.save({ validateModifiedOnly: true })
      
        const userDetails = await UserSchema.findOne({ _id: user._id }).select('-password');
    
        return res.send({
          success: true,
          response: userDetails,
          message: "Login successful",
        });
    } catch (err) {
      console.log(err);
      return commonService.sendResponseData(res, 500, false, err.message?err.message:err, {});
    }
};
  
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const findUser = await UserSchema.findById({_id:userId});
    if (!findUser) {
      throw {
        success: false,
        message: "sorry we can't find this user",
        response: null,
      };
    }
    const user = await UserSchema.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.userId) } },
      { $project: { password: 0 } }
  ]);
  return res.send({
    success: true,
    response: user,
    message: "Fetched profile",
  });
  } catch (err) {
    console.log(err);
    return commonService.sendResponseData(res, 500, false, err.message?err.message:err, {});
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    let updatedUser = req.body;
     const findUser = await UserSchema.findById({_id:userId})
    
     if (req.file){
      updatedUser.profilePicture =req.file.filename;

     } 
      
    for (let key in updatedUser) {
      findUser[key] = updatedUser[key];
    }
   
    const clientResp = await findUser.save({ validateModifiedOnly: true });
    console.log("clientResp==>", clientResp);
    return res.send({
      success: true,
      response: clientResp,
      message: "Profile updated successfully",
    });

  } catch (err) {
    // console.log(err);
    return commonService.sendResponseData(res, 500, false, err.message?err.message:err, {});
  }
};