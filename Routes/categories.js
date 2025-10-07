const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategories,
  createCategories,
  updateCategories,
  removeCategories,
} = require("../Controller/categories");

router.get("/categories/", getAllCategories);

router.get("/categories/:id", getCategories);

router.post("/categories", createCategories);

router.put("/categories/:id", updateCategories);

router.delete("/categories/:id", removeCategories);

module.exports = router;
