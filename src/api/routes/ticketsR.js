const express = require("express");
const router = express.Router();
const {
  create,
  read,
    readOne,
    update,
    del,
} = require("../controllers/ticketsC");

router.post("/tickets", create);
router.get("/tickets", read);
router.get("/tickets/:id", readOne);
router.put("/tickets/:id", update);

// only admin or dev
router.delete("/tickets/:id", del);

module.exports = router;
