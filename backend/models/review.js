"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for reviews. */

class Review {
  /** Create a review (from data), update db, return new review data.
   *
   * data should be { userId, productId, categoryId, rating, comment, date }
   *
   * Returns { id, userId, productId, categoryId, rating, comment, date }
   *
   * Throws BadRequestError if review already in database.
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO reviews
           (user_id, product_id, category_id, rating, comment, date)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, user_id AS "userId", product_id AS "productId", category_id AS "categoryId", rating, comment, date`,
      [
        data.userId,
        data.productId,
        data.categoryId,
        data.rating,
        data.comment,
        data.date,
      ]
    );
    const review = result.rows[0];

    return review;
  }

  /** Find all reviews (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - userId
   * - productId
   * - categoryId
   * - rating
   *
   * Returns [{ id, userId, productId, categoryId, rating, comment, date }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id,
                        user_id AS "userId",
                        product_id AS "productId",
                        category_id AS "categoryId",
                        rating,
                        comment,
                        date
                 FROM reviews`;
    let whereExpressions = [];
    let queryValues = [];

    const { userId, productId, categoryId, rating } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (userId !== undefined) {
      queryValues.push(userId);
      whereExpressions.push(`user_id = $${queryValues.length}`);
    }

    if (productId !== undefined) {
      queryValues.push(productId);
      whereExpressions.push(`product_id = $${queryValues.length}`);
    }

    if (categoryId !== undefined) {
      queryValues.push(categoryId);
      whereExpressions.push(`category_id = $${queryValues.length}`);
    }

    if (rating !== undefined) {
      queryValues.push(rating);
      whereExpressions.push(`rating = $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY date";
    const reviewsRes = await db.query(query, queryValues);
    return reviewsRes.rows;
  }

  /** Given a review id, return data about review.
   *
   * Returns { id, userId, productId, categoryId, rating, comment, date }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const reviewRes = await db.query(
      `SELECT id,
                  user_id AS "userId",
                  product_id AS "productId",
                  category_id AS "categoryId",
                  rating,
                  comment,
                  date
           FROM reviews
           WHERE id = $1`,
      [id]
    );

    const review = reviewRes.rows[0];

    if (!review) throw new NotFoundError(`No review: ${id}`);

    return review;
  }

  /** Update review data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {rating, comment, date}
   *
   * Returns {id, userId, productId, categoryId, rating, comment, date}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE reviews 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                user_id AS "userId", 
                                product_id AS "productId", 
                                category_id AS "categoryId", 
                                rating, 
                                comment, 
                                date`;
    const result = await db.query(querySql, [...values, id]);
    const review = result.rows[0];

    if (!review) throw new NotFoundError(`No review: ${id}`);

    return review;
  }

  /** Delete given review from database; returns undefined.
   *
   * Throws NotFoundError if review not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM reviews
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const review = result.rows[0];

    if (!review) throw new NotFoundError(`No review: ${id}`);
  }
}

module.exports = Review;

