const express = require("express");
const { body } = require("express-validator");
const { registerAdmin, getUserLogin, logout, getUserDetailsById, updateAdminDetails} = require("../controllers/adminController");

const router = express.Router();

// Registration Route
router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    ],
    registerAdmin
);
// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password").exists().withMessage("Password is required."),
  ],
  getUserLogin
);

//Get User Details
router.get("/user-details/:id", getUserDetailsById);
router.put("/admin/update/:id", updateAdminDetails);
// Logout Route
router.post("/logout", logout);

module.exports = router;
