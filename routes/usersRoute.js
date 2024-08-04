const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const middleware = require("../helper/middleware");
const fs = require("fs")
const multer = require('multer');
// Ensure the directory exists
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		if(file.fieldname == 'profilePicture') {
			const dir = 'public/uploads/profilePicture/';
			ensureDirExists(dir);
			cb(null, dir)
		} 
	},
	filename: function(req, file, cb) {
		if(file.fieldname!='') {
			var org_name = file.originalname;
			var pieces = org_name.split(".");
			var img_arr = pieces[pieces.length-1];
			cb(null, Date.now()+'.'+img_arr)
		}
	}
});

const fileImageFilter = (req, file, cb) => {
	if (file.fieldname.endsWith('_image') && !file.mimetype.startsWith('image/')) {
		req.fileValidationError = 'Invalid image format. Please upload jpeg,jpg or png format.';
		return cb(null, false);
	  }
	  cb(null, true);
  };
const uploadDealImage = multer({
	storage: storage, 
	fileFilter: fileImageFilter
}).single('profilePicture');

const checkFileValidationError = (req, res, next) => {
	if (req.fileValidationError) {
	   throw ({message: req.fileValidationError});
	}
	next();
  };

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//login
router.post("/login", userController.login);
// View user profile
router.get('/profile',middleware.chechAuthToken,userController.getProfile);
//edit profile
router.post('/edit-profile',middleware.chechAuthToken,uploadDealImage,checkFileValidationError,userController.editProfile);

  


module.exports = router;
