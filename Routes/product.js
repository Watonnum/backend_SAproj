const express = require("express");
const router = express.Router();
const {
  getID,
  list,
  create,
  update,
  removeID,
} = require("../Controller/product");

// get
router.get("/product", list);

// get:id
router.get("/product/:id", getID);

// post
router.post("/product", create);

// put
router.put("/product/:id", update);

// delete id
router.delete("/product/:id", removeID);

module.exports = router;
