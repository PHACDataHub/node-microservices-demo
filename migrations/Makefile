# Testing credentials
direction = up
user = bugbounty
password = test
host = localhost
database = bugbounty
DATABASE_URL = postgres://bugbounty:test@localhost:5432/bugbounty?sslmode=disable

.PHONY: testdb
testdb:
		docker run -d --network host -e POSTGRES_USER=$(user) -e POSTGRES_PASSWORD=$(password) postgres

.PHONY: migration
migration:
		migrate create -ext sql -dir migrations -seq $(name)

.PHONY: migrate
migrate:
		migrate -database $(DATABASE_URL) -path migrations $(direction)
