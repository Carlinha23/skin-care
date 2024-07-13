\echo 'Delete and recreate skin-care db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin-care";
CREATE DATABASE "skin-care";
\connect "skin-care"

\i skin-care-schema.sql
\i skin-care-seed.sql

\echo 'Delete and recreate skin-care_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "skin-care_test";
CREATE DATABASE "skin-care_test";
\connect "skin-care_test"

\i skin-care-schema.sql

