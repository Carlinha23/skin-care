const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");
const jsonschema = require("jsonschema");
const reviewNewSchema = require("../schemas/reviewNew.json");
const Product = require("./product");

const reviewRouter = new express.Router();

reviewRouter.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    // Log the request body and authenticated user
    console.log("Request body:", req.body);
    console.log("Authenticated user:", res.locals.user);

    const validator = jsonschema.validate(req.body, reviewNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Add the username from the token to the request body
    const reviewData = { ...req.body, username: res.locals.user.username };
    const review = await Review.create(reviewData);
    return res.status(201).json({ review });
  } catch (err) {
    // Log the error
    console.error("Error in POST /reviews:", err);
    return next(err);
  }
});

reviewRouter.get("/", async function (req, res, next) {
  try {
    const { category, productname } = req.query;
    const searchFilters = {};

    // Log incoming query parameters
    console.log("Incoming Query Params:", req.query);

    if (category) {
      searchFilters.categoryId = category;
    }

    if (productname) {
      searchFilters.productName = productname;
    }

    // Log the constructed search filters
    console.log("Search Filters:", searchFilters);

    const reviews = await Review.findAll(searchFilters);
    return res.json({ reviews });
  } catch (err) {
    console.error("Error in GET /reviews:", err);
    return next(err);
  }
});


reviewRouter.get("/:id", async function (req, res, next) {
  try {
    const review = await Review.get(req.params.id);
    return res.json({ review });
  } catch (err) {
    // Log the error
    console.error(`Error in GET /reviews/${req.params.id}:`, err);
    return next(err);
  }
});

// New route to get all reviews by product name
reviewRouter.get('/api/reviews/product/:productname', async (req, res, next) => {
  try {
    const { productname } = req.params;
    const reviews = await Review.findAll({ where: { productname } });
    if (reviews.length === 0) {
      return res.status(404).json({ message: `No reviews found for product: ${productname}` });
    }
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

module.exports = reviewRouter;
