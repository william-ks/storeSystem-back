const express = require("express");
const router = express.Router();
const {
  create,
  read,
  readOne,
  updateSelf,
  updateSelfPass,
  del,
} = require("../controllers/usersC");

router.post("/users", create);
router.get("/users", read);
router.get("/users/:id", readOne);
router.put("/users", updateSelf);
router.put("/users/pass", updateSelfPass);

// only admin or dev
router.delete("/users/:id", del);

module.exports = router;
