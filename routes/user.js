const userController = require("../controllers/user");
const { upload } = require("../uploadImages");
const express = require("express");
const multer = require("multer");

const router = express.Router();

router.get("/profile", userController.profile);

router.get("/user/:id", userController.userPage);

router.post("/deleteProject/:id", userController.deleteProject);

router.post("/updateAccount", upload.single("image"), userController.updateAccount);

router.post("/addReview", userController.addReview);

router.post("/updateProject", userController.updateProject);

router.post(
  "/addProject",
  upload.fields([{ name: "images", maxCount: 10 }]),
  // errorHandler,
  userController.addProject,
);

module.exports = router;
