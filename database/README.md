# The database

This demo uses the [Postgres](https://www.postgresql.org). Usage of the Postgres dialect of SQL creates lock-in to the Postgres API, but we are still portable within the rich ecosystem of Postgres compatible databases ([Google AlloyDB](https://cloud.google.com/alloydb), [Azure Postgres](https://azure.microsoft.com/en-ca/services/postgresql/), [AWS Aurora](https://aws.amazon.com/blogs/aws/amazon-aurora-postgresql-serverless-now-generally-available/), [CockroachDB](https://www.cockroachlabs.com/), [Neon](https://neon.tech/), [ImmuDB](https://docs.immudb.io/master) and many others).
taking advantage of the overlay filesystem to create a database that has a working disk but doesn't persist it's data.

## Exploring the database

With the database running in Kubernetes you can port forward it and talk to ask though it were on your local machine.

```bash
# In one terminal:
$ kubectl port-forward -n database svc/postgres 5432:5432
# In another terminal
$ psql --host=localhost --username=bugbounty
psql (14.3)
Type "help" for help.

bugbounty=# 
bugbounty=# \dt
               List of relations
 Schema |       Name        | Type  |   Owner   
--------+-------------------+-------+-----------
 public | bugs              | table | bugbounty
 public | schema_migrations | table | bugbounty
(2 rows)
```
