const express = require("express");
const router = express.Router();
const {
  create,
  read,
  readOne,
  update,
  del,
} = require("../controllers/clientsC");

router.post("/clients", create);
router.get("/clients", read);
router.get("/clients/:id", readOne);
router.put("/clients/:id", update);

// only admin or dev
router.delete("/clients/:id", del);

module.exports = router;
