# API migration

Migrations take a database from one state to another state. This service applies the migrations in the migrations folder and then exits.
`make` is used to provide some easy to use commands to make development easy.
Docker is assumed.

## Installing `migrate`

Instructions for the `migrate` command can be found [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

## Creating migrations

Testing out migrations requires a working database to test against. You can create one with default testing variables with the following command.
```bash
[mike@ouroboros api-migration]$ make testdb 
docker run -d --network host -e POSTGRES_USER=bugbounty -e POSTGRES_PASSWORD=test postgres
281fc0802c86d4a2c1a6c8a0cd18ed35814bf0626d18c11c4bd8fdd7fdb5d7b5
```
After than you can create new migrations like this:
```bash
$ make migration name=create_dogs
migrate create -ext sql -dir migrations -seq create_dogs
/home/mike/projects/node-demo/api-migration/migrations/000002_create_dogs.up.sql
/home/mike/projects/node-demo/api-migration/migrations/000002_create_dogs.down.sql
```

## Applying migrations

The variables in the `Makefile` specify that migrations are `up` by default.
```bash
$ make migrate 
migrate -database postgres://bugbounty:test@localhost:5432/bugbounty?sslmode=disable -path migrations up
1/u create_bugs (26.524125ms)
```
If you want to migrate the other direction:

```bash
migrate -database postgres://bugbounty:test@localhost:5432/bugbounty?sslmode=disable -path migrations down
Are you sure you want to apply all down migrations? [y/N]
y
Applying all down migrations
1/d create_bugs (30.548166ms)
```
## Cleaning up

Shutdown running containers with `docker stop $(docker ps -q)`
