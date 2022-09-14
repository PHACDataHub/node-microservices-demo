#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_USER" <<-EOSQL
DO \$\$
BEGIN
	 IF EXISTS (
      SELECT * FROM pg_catalog.pg_roles
      WHERE  rolname = '$API_USER'
) THEN
  RAISE NOTICE 'Role "$API_USER" already exists. Skipping.';
  ELSE
      BEGIN   -- nested block
         CREATE ROLE $API_USER LOGIN PASSWORD '$API_PASSWORD';
      EXCEPTION
         WHEN duplicate_object THEN
            RAISE NOTICE 'Role "$API_USER" was just created by a concurrent transaction. Skipping.';
      END;
   END IF;
END\$\$
EOSQL
