//middleware for mu
const multer = require("multer");
//config images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); //errors, destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); //added date so that image names arent repeated
  },
});


exports.upload = multer({ storage });
