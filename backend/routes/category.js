"use strict";

/** Routes for categories. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Category = require("../models/category");

const categoryNewSchema = require("../schemas/categoryNew.json");
const categoryUpdateSchema = require("../schemas/categoryUpdate.json");

const router = new express.Router();

/** POST / { category } =>  { category }
 *
 * category should be { name }
 *
 * Returns { id, name }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.create(req.body);
    return res.status(201).json({ category });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { categories: [ { id, name }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const categories = await Category.findAll();
    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { category }
 *
 *  Category is { id, name }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const category = await Category.get(req.params.id);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { category }
 *
 * Patches category data.
 *
 * fields can be: { name }
 *
 * Returns { id, name }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.update(req.params.id, req.body);
    return res.json({ category });
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
    await Category.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
