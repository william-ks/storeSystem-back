const express = require("express");
const router = express.Router();
const login = require("../controllers/login");
const usersR = require("./usersR.js");

router.post("/login", login);

router.use(usersR)

module.exports = router;
