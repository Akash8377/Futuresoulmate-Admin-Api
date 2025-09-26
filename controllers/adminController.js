const { validationResult } = require("express-validator");
const conn = require("../services/db")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const token_key = process.env.TOKEN_KEY;

// Admin Registration function
exports.registerAdmin = (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    const { email, password, username } = req.body; // <-- Include username here

    // Check if the admin already exists
    conn.query(
        `SELECT * FROM admin WHERE email = ?`,
        [email],
        (err, result) => {
            if (err) {
                console.error("Error querying database:", err); // Log the error
                return res.status(500).send({ msg: err });
            }
            if (result.length) {
                return res.status(400).send({ msg: "Admin already exists!" });
            }

            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Insert new admin into the database
            const sql = `INSERT INTO admin (email, password, username) VALUES (?, ?, ?)`; // <-- Include username in SQL query
            conn.query(sql, [email, hashedPassword, username], (insertErr) => { // <-- Include username in values
                if (insertErr) {
                    console.error("Error inserting admin:", insertErr); // Log the error
                    return res.status(500).send({ msg: insertErr });
                }
                res.status(201).send({ msg: "Admin registered successfully!" });
            });
        }
    );
};

// Admin Login function
exports.getUserLogin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  conn.query(
    `SELECT * FROM admin WHERE email = ?`,
    [req.body.email],
    (err, result) => {
      if (err) {
        return res.status(400).send({ msg: err });
      }
      if (!result.length) {
        return res.status(400).send({ msg: "Email or Password is incorrect!" });
      }

      bcrypt.compare(req.body.password, result[0]["password"], (bErr, bresult) => {
        if (bErr) {
          return res.status(400).send({ msg: bErr });
        }
        if (bresult) {
          const token = jwt.sign(
            { id: result[0]["id"], is_admin: result[0]["is_admin"] },
            token_key,
            { expiresIn: "1d" } // Optional: Token expiration
          );
          conn.query(
            `UPDATE admin SET last_login = NOW() WHERE id = ?`,
            [result[0]["id"]]
          );
          res.status(200).send({
            status: "success",
            token,
            length: result.length,
            data: result,
          });
        } else {
          return res.status(400).send({ msg: "Email or Password is incorrect!" });
        }
      });
    }
  );
};

// Logout Function
exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "Token is required for logout" });
  }

  res.status(200).send({ message: "Logged out successfully" });
};

exports.getUserDetailsById = (req, res) => {
    const userId = req.params.id; 

    if (!userId) {
        return res.status(400).send({ msg: "User ID is required" });
    }

    // Query the database to fetch user details
    conn.query(
        `SELECT id, email, username, password, last_login FROM admin WHERE id = ?`,
        [userId],
        (err, result) => {
            if (err) {
                console.error("Error querying database:", err);
                return res.status(500).send({ msg: "Database error" });
            }
            if (!result.length) {
                return res.status(404).send({ msg: "User not found" });
            }

            res.status(200).send({
                status: "success",
                data: result[0], // Send the first user result
            });
        }
    );
};

// Admin Update Function (Update email, username, and password)
exports.updateAdminDetails = (req, res) => {
  const { email, username, password } = req.body;
  const adminId = req.params.id;

  // Validate input
  if (!email || !username) {
      return res.status(400).send({ msg: "Email and Username are required" });
  }

  // Optional: Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
      return res.status(400).send({ msg: "Invalid email format" });
  }

  // If password is provided, hash it
  let hashedPassword = null;
  if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
  }

  // Check if the admin exists in the database
  conn.query(
      `SELECT * FROM admin WHERE id = ?`,
      [adminId],
      (err, result) => {
          if (err) {
              console.error("Error querying database:", err);
              return res.status(500).send({ msg: "Database error" });
          }
          if (!result.length) {
              return res.status(404).send({ msg: "Admin not found" });
          }

          // Update the admin details (email, username, password if provided)
          const sql = `UPDATE admin SET email = ?, username = ?${password ? ", password = ?" : ""} WHERE id = ?`;
          const queryParams = [email, username, ...(password ? [hashedPassword] : []), adminId];

          conn.query(sql, queryParams, (updateErr) => {
              if (updateErr) {
                  console.error("Error updating admin:", updateErr);
                  return res.status(500).send({ msg: "Error updating admin details" });
              }
              res.status(200).send({ msg: "Admin details updated successfully" });
          });
      }
  );
};
