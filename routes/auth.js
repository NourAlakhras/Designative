const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.logout);

module.exports = router;
