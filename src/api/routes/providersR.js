const express = require("express");
const router = express.Router();
const {
  create,
  read,
  readOne,
  update,

  del,
} = require("../controllers/providersC");

router.post("/providers", create);
router.get("/providers", read);
router.get("/providers/:id", readOne);
router.put("/providers/:id", update);

// only admin or dev
router.delete("/providers/:id", del);

module.exports = router;
