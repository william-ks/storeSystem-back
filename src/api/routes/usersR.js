const express = require("express");
const router = express.Router();
const { create, read, updateSelf } = require("../controllers/usersC");

router.post("/users", create);
router.get("/users", read);
router.put("/users", updateSelf);


module.exports = router;
