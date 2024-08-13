\echo 'Delete and recreate skin-care db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin_care3";
CREATE DATABASE "skin_care3";
\connect "skin_care3"

\i skin-care-schema.sql
\i skin-care-seed.sql

\echo 'Delete and recreate skin-care_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin-care_test2";
CREATE DATABASE "skin-care_test2";
\connect "skin-care_test2"

\i skin-care-schema.sql

