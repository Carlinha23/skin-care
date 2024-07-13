"use strict";

/** Routes for reviews. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");

const reviewNewSchema = require("../schemas/reviewNew.json");
const reviewUpdateSchema = require("../schemas/reviewUpdate.json");

const router = new express.Router();

/** POST / { review } =>  { review }
 *
 * review should be { rating, title, comment, userId, productId }
 *
 * Returns { id, rating, title, comment, userId, productId }
 *
 * Authorization required: logged in user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
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

/** GET /  =>
 *   { reviews: [ { id, rating, title, comment, userId, productId }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const reviews = await Review.findAll();
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { review }
 *
 *  Review is { id, rating, title, comment, userId, productId }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const review = await Review.get(req.params.id);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { review }
 *
 * Patches review data.
 *
 * fields can be: { rating, title, comment }
 *
 * Returns { id, rating, title, comment, userId, productId }
 *
 * Authorization required: logged in user
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, reviewUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const review = await Review.update(req.params.id, req.body);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or the user who created the review
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const review = await Review.get(req.params.id);

    if (req.user.id !== review.userId && !req.user.isAdmin) {
      throw new NotFoundError();
    }

    await Review.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
