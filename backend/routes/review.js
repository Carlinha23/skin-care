const express = require("express");
const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");
const jsonschema = require("jsonschema");
const reviewNewSchema = require("../schemas/reviewNew.json");

const reviewRouter = new express.Router();

reviewRouter.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, reviewNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const review = await Review.create(req.body);
    return res.status(201).json({ review });
  } catch (err) {
    return next(err);
  }
});

reviewRouter.get("/", async function (req, res, next) {
  try {
    const reviews = await Review.findAll(req.query);
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

reviewRouter.get("/:id", async function (req, res, next) {
  try {
    const review = await Review.get(req.params.id);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});

module.exports = reviewRouter;
