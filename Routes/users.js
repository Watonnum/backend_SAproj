const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersId,
  createUsers,
  removeUsers,
  updateUsers,
} = require("../Controller/users");
const {
  authenticateToken,
  checkPermission,
  requireAdmin,
} = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// เฉพาะ admin เท่านั้นที่จัดการ users ได้
router.get("/users", requireAdmin, getUsers);

router.get("/users/:id", requireAdmin, getUsersId);

router.post("/users", requireAdmin, createUsers);

router.put("/users/:id", requireAdmin, updateUsers);

router.delete("/users/:id", requireAdmin, removeUsers);

module.exports = router;
