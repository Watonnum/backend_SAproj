const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersId,
  createUsers,
  removeUsers,
  updateUsers,
} = require("../Controller/users");

router.get("/users/", getUsers);

router.get("/users/:id", getUsersId);

router.post("/users/:id", createUsers);

router.put("/users/:id", updateUsers);

router.delete("/users/:id", removeUsers);

module.exports = router;
