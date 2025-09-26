const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();
router.get("/get-users", usersController.getUsers);

module.exports = router;
