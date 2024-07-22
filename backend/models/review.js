"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for reviews. */

class Review {
  /** Create a review (from data), update db, return new review data.
   *
   * data should be { userId, categoryId, productName, brand, comment, image, date }
   *
   * Returns { id, userId, categoryId, productName, brand, comment, image, date }
   *
   * Throws BadRequestError if review already in database.
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO reviews
           (username, categoryid, productname, brand, comment, image, date)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING reviewid AS id, username AS username, categoryid AS categoryId, productname AS productName, brand, comment, image, date`,
      [
        data.username,
        data.categoryId,
        data.productName,
        data.brand,
        data.comment,
        data.image,
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
   * - categoryId
   * - productName
   * - brand
   *
   * Returns [{ id, userId, categoryId, productName, brand, comment, image, date }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT reviewid AS id,
                        username AS userId,
                        categoryid AS categoryId,
                        productname AS productName,
                        brand,
                        comment,
                        image,
                        date
                 FROM reviews`;
    let whereExpressions = [];
    let queryValues = [];

    const { userId, categoryId, productName, brand } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (userId !== undefined) {
      queryValues.push(userId);
      whereExpressions.push(`username = $${queryValues.length}`);
    }

    if (categoryId !== undefined) {
      queryValues.push(categoryId);
      whereExpressions.push(`categoryid = $${queryValues.length}`);
    }

    if (productName !== undefined) {
      queryValues.push(productName);
      whereExpressions.push(`productname ILIKE $${queryValues.length}`);
    }

    if (brand !== undefined) {
      queryValues.push(brand);
      whereExpressions.push(`brand ILIKE $${queryValues.length}`);
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
   * Returns { id, userId, categoryId, productName, brand, comment, image, date }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const reviewRes = await db.query(
      `SELECT reviewid AS id,
                  username AS userId,
                  categoryid AS categoryId,
                  productname AS productName,
                  brand,
                  comment,
                  image,
                  date
           FROM reviews
           WHERE reviewid = $1`,
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
   * Data can include: {productName, brand, comment, image, date}
   *
   * Returns {id, userId, categoryId, productName, brand, comment, image, date}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE reviews 
                      SET ${setCols} 
                      WHERE reviewid = ${idVarIdx} 
                      RETURNING reviewid AS id, 
                                username AS userId, 
                                categoryid AS categoryId, 
                                productname AS productName, 
                                brand, 
                                comment, 
                                image, 
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
           WHERE reviewid = $1
           RETURNING reviewid`,
      [id]
    );
    const review = result.rows[0];

    if (!review) throw new NotFoundError(`No review: ${id}`);
  }

}

module.exports = Review;
