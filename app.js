const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // Add this
require("dotenv").config();
require("./services/db");
const app = express();

const adminRoutes = require("./routes/adminRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const usersRoutes = require("./routes/usersRoutes");
const planRoutes = require("./routes/planRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

// Use morgan with "dev" format - this will give you the exact logging you want
app.use(morgan("dev"));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve("./public")));
app.use(express.static(path.join(__dirname, "public")));
global.__basedir = __dirname;

app.use("/", adminRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/users", usersRoutes);
app.use("/plans", planRoutes);
app.use("/notifications", notificationRoutes);
app.use("/conversations", conversationRoutes);

const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});

module.exports = app;

// const path = require("path");
// const bodyParser = require("body-parser");
// require("dotenv").config();
// require("./services/db");
// const app = express();

// const adminRoutes = require("./routes/adminRoutes");
// const subscriptionRoutes = require("./routes/subscriptionRoutes");
// const usersRoutes = require("./routes/usersRoutes");
// const planRoutes = require("./routes/planRoutes");

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.resolve("./public")));
// app.use(express.static(path.join(__dirname, "public")));
// global.__basedir = __dirname;

// app.use("/", adminRoutes);
// app.use("/subscriptions", subscriptionRoutes);
// app.use("/users", usersRoutes);
// app.use("/plans", planRoutes);

// const hostname = process.env.HOST || "0.0.0.0";
// const port = process.env.PORT || 5000;

// app.listen(port, hostname, () => {
//   console.log(`Server running on http://${hostname}:${port}`);
// });

// module.exports = app;
