"use strict";

/** Routes for products. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Product = require("../models/product");

const productNewSchema = require("../schemas/productNew.json");
const productUpdateSchema = require("../schemas/productUpdate.json");
const productSearchSchema = require("../schemas/productSearch.json");

const router = new express.Router();

/** POST / { product } =>  { product }
 *
 * product should be { name, categoryId, brand, description, price }
 *
 * Returns { id, name, categoryId, brand, description, price }
 *
 * Authorization required: admin
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, productNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const product = await Product.create(req.body);
    return res.status(201).json({ product });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { products: [ { id, name, categoryId, brand, description, price }, ...] }
 *
 * Can filter on provided search filters:
 * - categoryId
 * - brand
 * - priceMin
 * - priceMax
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as numbers
  if (q.priceMin !== undefined) q.priceMin = +q.priceMin;
  if (q.priceMax !== undefined) q.priceMax = +q.priceMax;

  try {
    const validator = jsonschema.validate(q, productSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const products = await Product.findAll(q);
    return res.json({ products });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { product }
 *
 *  Product is { id, name, categoryId, brand, description, price }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const product = await Product.get(req.params.id);
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { product }
 *
 * Patches product data.
 *
 * fields can be: { name, categoryId, brand, description, price }
 *
 * Returns { id, name, categoryId, brand, description, price }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, productUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const product = await Product.update(req.params.id, req.body);
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Product.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

