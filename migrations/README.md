# API migration

Migrations take a database from one state to another state. This service applies the migrations in the migrations folder and then exits.
`make` is used to provide some easy to use commands to make development easy.
Docker is assumed.

## Installing `migrate`

Instructions for the `migrate` command can be found [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

## Creating a test database

We use the official postgres docker image to test migrations. Just run `make db` on a linux based system and you'll have a functioning database.

```bash
[mike@ouroboros migrations]$ make db
docker run -d --network host -e POSTGRES_USER=bugbounty -e POSTGRES_PASSWORD=secret postgres
8c80a9e915e0a0fe0325686780cd86349ee3e2ca5d3419b4cf43450f2aab38c2
# Wait till posgres is listening
while (! (: </dev/tcp/localhost/5432) &> /dev/null); do sleep 0.5; done
# our database creates a user at startup, so we should simulate that too:
psql --host=localhost --username=bugbounty -c "CREATE ROLE leastprivilegeuser LOGIN PASSWORD 'test';"
CREATE ROLE
```

You'll be able to connect as the bugbounty admin users like this:

```bash
$ psql --host=localhost --username=bugbounty
psql (14.3, server 13.2 (Debian 13.2-1.pgdg100+1))
Type "help" for help.

bugbounty=# 
```

## Applying migrations to the test database

The variables in the `Makefile` specify that migrations are `up` by default.
```bash
$ make migrate
migrate -database postgres://bugbounty:secret@localhost:5432/bugbounty?sslmode=disable -path migrations up
1/u create_bugs (22.989499ms)
2/u add-test-data (40.969189ms)
3/u grant_privs_to_api_user (61.50811ms)
```

After that the admin user should be able to see two users:

```bash
$ psql --host=localhost --username=bugbounty -P pager=off -c "SELECT * FROM pg_catalog.pg_user;"
      usename       | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil | useconfig 
--------------------+----------+-------------+----------+---------+--------------+----------+----------+-----------
 bugbounty          |       10 | t           | t        | t       | t            | ******** |          | 
 leastprivilegeuser |    16385 | f           | f        | f       | f            | ******** |          | 
(2 rows)
$ psql --host=localhost --username=leastprivilegeuser --dbname=bugbounty -P pager=off -c "SELECT * FROM BUGS;"
 id |                     title                     |                                                      description                                                      |    status     |       url       |  foundon   
----+-----------------------------------------------+-----------------------------------------------------------------------------------------------------------------------+---------------+-----------------+------------
  1 | Reflective XSS found on customer support page | The "contact us for support" form allows for js to be supplied in the "issue" field which is then executed after save | investigating | www.example.com | 2022-04-28
(1 row)
```
You should be able to successfully query the bugs table as the `leastprivilegeuser`:
```bash
$ psql --host=localhost --username=leastprivilegeuser --dbname=bugbounty -P pager=off -c "SELECT * FROM BUGS;"
 id |                     title                     |                                                      description                                                      |    status     |       url       |  foundon   
----+-----------------------------------------------+-----------------------------------------------------------------------------------------------------------------------+---------------+-----------------+------------
  1 | Reflective XSS found on customer support page | The "contact us for support" form allows for js to be supplied in the "issue" field which is then executed after save | investigating | www.example.com | 2022-04-28
(1 row)

```

## Testing the migrations work in reverse

If you want to migrate the other direction, specify the direction as "down".

```bash
[mike@ouroboros migrations]$ make migrate direction=down
migrate -database postgres://bugbounty:secret@localhost:5432/bugbounty?sslmode=disable -path migrations down
Are you sure you want to apply all down migrations? [y/N]
y
Applying all down migrations
3/d grant_privs_to_api_user (29.377262ms)
2/d add-test-data (60.51318ms)
1/d create_bugs (86.104349ms)
```

## Cleaning up

Shutdown running containers with `make itstop`

## Creating new migrations

You can generate new migrations like this:
```bash
$ make migration name=create_dogs
migrate create -ext sql -dir migrations -seq create_dogs
/home/mike/projects/node-demo/api-migration/migrations/000002_create_dogs.up.sql
/home/mike/projects/node-demo/api-migration/migrations/000002_create_dogs.down.sql
```
