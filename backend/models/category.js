"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for categories. */

class Category {
  /** Find all categories.
   *
   * Returns [{ id, name }, ...]
   * */

  static async findAll() {
    const categoriesRes = await db.query(
      `SELECT id, name
       FROM categories
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
      `SELECT id, name
       FROM categories
       WHERE id = $1`,
      [id]
    );

    const category = categoryRes.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

    return category;
  }
}

module.exports = Category;
