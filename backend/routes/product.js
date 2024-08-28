const express = require("express");
const Product = require("../models/product");

const router = new express.Router();

router.get("/", async function (req, res, next) {
  try {
    const searchFilters = {};

    if (req.query.productname) {
      searchFilters.productName = req.query.productname;
    }

    const products = await Product.findAll(searchFilters);
    return res.json({ products });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
