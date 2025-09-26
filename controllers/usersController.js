const { validationResult } = require("express-validator");
const conn = require("../services/db");
require("dotenv").config();

exports.getUsers = (req, res) => {
conn.query(
  `SELECT u.*, p.* 
   FROM users u 
   LEFT JOIN profiles p ON u.id = p.user_id`,
  (err, usersWithProfiles) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no users found, return empty array
    if (!usersWithProfiles || usersWithProfiles.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Directly return all data from both tables
    res.status(200).json({ users: usersWithProfiles });
  }
);

};
