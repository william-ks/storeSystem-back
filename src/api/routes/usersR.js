const express = require("express");
const router = express.Router();
const {
  create,
  read,
  updateSelf,
  updateSelfPass,
} = require("../controllers/usersC");

router.post("/users", create);
router.get("/users", read);
router.put("/users", updateSelf);
router.put("/users/pass", updateSelfPass);


module.exports = router;
