"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for products. */

class Product {
  /** Create a product (from data), update db, return new product data.
   *
   * data should be { name, categoryId, brand, image }
   *
   * Returns { id, name, categoryId, brand, image }
   *
   * Throws BadRequestError if product already in database.
   * */

  static async create({ name, categoryId, brand, image }) {
    const duplicateCheck = await db.query(
      `SELECT name
       FROM products
       WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate product: ${name}`);

    const result = await db.query(
      `INSERT INTO products
       (name, category_id, brand, image)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, category_id AS "categoryId", brand, image`,
      [name, categoryId, brand, image]
    );
    const product = result.rows[0];

    return product;
  }

  /** Find all products (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - categoryId
   * - brand
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, name, categoryId, brand, image }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id,
                        name,
                        category_id AS "categoryId",
                        brand,
                        image
                 FROM products`;
    let whereExpressions = [];
    let queryValues = [];

    const { categoryId, brand, name } = searchFilters;

    if (categoryId !== undefined) {
      queryValues.push(categoryId);
      whereExpressions.push(`category_id = $${queryValues.length}`);
    }

    if (brand) {
      queryValues.push(`%${brand}%`);
      whereExpressions.push(`brand ILIKE $${queryValues.length}`);
    }

    if (name) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY name";
    const productsRes = await db.query(query, queryValues);
    return productsRes.rows;
  }

  /** Given a product id, return data about product.
   *
   * Returns { id, name, categoryId, brand, image }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const productRes = await db.query(
      `SELECT id,
              name,
              category_id AS "categoryId",
              brand,
              image
       FROM products
       WHERE id = $1`,
      [id]
    );

    const product = productRes.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);

    return product;
  }

  /** Update product data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, categoryId, brand, image}
   *
   * Returns {id, name, categoryId, brand, image}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        categoryId: "category_id"
      }
    );
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE products 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                category_id AS "categoryId", 
                                brand, 
                                image`;
    const result = await db.query(querySql, [...values, id]);
    const product = result.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);

    return product;
  }

  /** Delete given product from database; returns undefined.
   *
   * Throws NotFoundError if product not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
       FROM products
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const product = result.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);
  }
}

module.exports = Product;
