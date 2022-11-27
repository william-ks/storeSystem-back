const express = require("express");
const router = express.Router();
const { create } = require("../controllers/usersC");

router.post("/users", create);

module.exports = router;
