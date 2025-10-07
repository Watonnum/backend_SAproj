const express = require("express");
const router = express.Router();
const {
  getID,
  list,
  create,
  update,
  removeID,
} = require("../Controller/products");

// get
router.get("/products", list);

// get:id
router.get("/products/:id", getID);

// post
router.post("/products", create);

// put
router.put("/products/:id", update);

// delete id
router.delete("/products/:id", removeID);

module.exports = router;
