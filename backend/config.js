"use strict";

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const config = {
  SECRET_KEY: process.env.SECRET_KEY || "secret-dev",
  PORT: parseInt(process.env.PORT, 10) || 3001,
  BCRYPT_WORK_FACTOR: process.env.NODE_ENV === "test" ? 1 : parseInt(process.env.BCRYPT_WORK_FACTOR, 10) || 12,

  getDatabaseUri: () => {
    return process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;
  }
};



module.exports = config;

