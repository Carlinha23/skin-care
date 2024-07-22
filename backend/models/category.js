"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for categories. */

class Category {
  /** Find all categories.
   *
   * Returns [{ categoryid, name }, ...]
   * */

  static async findAll() {
    const categoriesRes = await db.query(
      `SELECT categoryid AS id, name
       FROM category
       ORDER BY name`
    );
    return categoriesRes.rows;
  }

  /** Given a category id, return data about category.
   *
   * Returns { id, name }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const categoryRes = await db.query(
      `SELECT categoryid AS id, name
       FROM category
       WHERE categoryid = $1`,
      [id]
    );

    const category = categoryRes.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

    return category;
  }

  /** Create a category (from data), update db, return new category data.
   *
   * data should be { name }
   *
   * Returns { id, name }
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO category (name)
       VALUES ($1)
       RETURNING categoryid AS id, name`,
      [data.name]
    );
    const category = result.rows[0];

    return category;
  }

  /** Update category data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { name }
   *
   * Returns { id, name }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const result = await db.query(
      `UPDATE category
       SET name = $1
       WHERE categoryid = $2
       RETURNING categoryid AS id, name`,
      [data.name, id]
    );

    const category = result.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

    return category;
  }

  /** Delete given category from database; returns undefined.
   *
   * Throws NotFoundError if category not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
       FROM category
       WHERE categoryid = $1
       RETURNING categoryid`,
      [id]
    );
    const category = result.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);
  }
}

module.exports = Category;


