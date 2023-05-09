const express = require("express");
const adminContorller = require("../controllers/admin");
const router = express.Router();

router.get("/", adminContorller.index);
router.get("/projects", adminContorller.getProjects);

router.get("/deleteAccount/:id", adminContorller.deleteAccount);

router.get("/approveProject/:id", adminContorller.approveProject);

router.get("/rejectProject/:id", adminContorller.rejectProject);

module.exports = router;
