const indexController = require("../controllers/index");
const projectsController = require("../controllers/projects");
const isAuth = require("../middleware/isAuth");

const express = require("express");

const router = express.Router();

router.get("/", indexController.index);
router.get("/about", indexController.aboutUs);

router.get("/contact", indexController.contactUs);
router.post("/contact", indexController.sendEmail);

router.get("/faq", indexController.FAQ);

router.get("/category", isAuth, projectsController.category);

router.get("/projects", isAuth, projectsController.projects);

module.exports = router;
