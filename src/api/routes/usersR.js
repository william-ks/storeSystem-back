const express = require("express");
const router = express.Router();
const { create, readAll } = require("../controllers/usersC");

router.post("/users", create);
router.get('/users', readAll)

module.exports = router;
