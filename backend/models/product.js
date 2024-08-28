"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Product {
    static async findAll(searchFilters = {}) {
      let query = `
        SELECT reviewid AS id,
               username AS userId,
               categoryid AS categoryId,
               productname AS productName,
               brand,
               comment,
               image,
               date
        FROM reviews
      `;
      let whereExpressions = [];
      let queryValues = [];
  
      const { productName } = searchFilters;
  
      if (productName) {
        queryValues.push(`%${productName}%`);
        whereExpressions.push(`productname ILIKE $${queryValues.length}`);
      }
  
      if (whereExpressions.length > 0) {
        query += " WHERE " + whereExpressions.join(" AND ");
      }
  
      query += " ORDER BY date DESC";
  
      console.log("Final Query:", query);
      console.log("Query Values:", queryValues);
  
      const results = await db.query(query, queryValues);
      return results.rows;
    }
  }
  
  module.exports = Product;