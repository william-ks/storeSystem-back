const express = require("express");
const router = express.Router();
const login = require("../controllers/login");
const usersR = require("./usersR.js");
const providersR = require("./providersR");
const ticketsR = require("./ticketsR");
const ClientsR = require("./clientsR");
const auth = require("../middlewares/auth");

router.post("/login", login);

// validate token and save user
router.use(auth);

router.use(usersR);
router.use(providersR);
router.use(ticketsR);
router.use(ClientsR);

module.exports = router;
