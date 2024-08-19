\echo 'Delete and recreate skin-care db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin_care3";
CREATE DATABASE "skin_care3";
\connect "skin_care3"

\i skin-care-schema.sql
\i skin-care-seed.sql

\echo 'Delete and recreate skin_care3_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin_care3_test";
CREATE DATABASE "skin_care3_test";
\connect "skin_care3_test"

\i skin-care-schema.sql

