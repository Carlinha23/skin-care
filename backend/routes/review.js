const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");

const reviewNewSchema = require("../schemas/reviewNew.json");
//const reviewUpdateSchema = require("../schemas/reviewUpdate.json");

const router = new express.Router();

/** POST / { review } =>  { review }
 *
 * review should be { userId, categoryId, productName, brand, comment, image, date }
 *
 * Returns { id, userId, categoryId, productName, brand, comment, image, date }
 *
 * Authorization required: logged in user
 */
router.get('/', (req, res) => {
  res.send('Hello, World!');
});


router.post("/",ensureLoggedIn, async function (req, res, next) {
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
 *   { reviews: [ { id, userId, categoryId, productName, brand, comment, image, date }, ...] }
 *
 * Authorization required: none
 */

router.get("/all", async function (req, res, next) {
  try {
    const reviews = await Review.findAll(req.query);
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { review }
 *
 *  Review is { id, userId, categoryId, productName, brand, comment, image, date }
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



module.exports = router;
