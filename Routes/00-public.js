const express = require("express");
const router = express.Router();
const { getUserByEmail, quickLogin } = require("../Controller/users");

// Public routes ที่ไม่ต้องการ authentication
router.get("/users/email/:email", getUserByEmail);
router.post("/users/quick-login", quickLogin);

module.exports = router;
