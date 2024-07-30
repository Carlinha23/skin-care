"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Category = require("../models/category");
const categoryNewSchema = require("../schemas/categoryNew.json");
const categoryUpdateSchema = require("../schemas/categoryUpdate.json");

const categoryRouter = new express.Router();

categoryRouter.post("/", ensureAdmin, async function (req, res, next) {
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

categoryRouter.get("/", async function (req, res, next) {
  try {
    const categories = await Category.findAll();
    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

categoryRouter.get("/:id", async function (req, res, next) {
  try {
    const category = await Category.get(req.params.id);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

categoryRouter.patch("/:id", ensureAdmin, async function (req, res, next) {
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

categoryRouter.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Category.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = categoryRouter;
