const express = require("express");
const router = express.Router();
const login = require("../controllers/login");
const usersR = require("./usersR.js");
const providersR = require("./providersR");
const auth = require("../middlewares/auth");

router.post("/login", login);

// validate token and save user
router.use(auth);

router.use(usersR);
router.use(providersR);

module.exports = router;
