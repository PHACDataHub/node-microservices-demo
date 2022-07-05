# Testing credentials
direction = up
user = bugbounty
password = secret
host = localhost
database = bugbounty
DATABASE_URL = postgres://bugbounty:$(password)@localhost:5432/bugbounty?sslmode=disable

.PHONY: db
db:
		docker run -d --network host -e POSTGRES_USER=$(user) -e POSTGRES_PASSWORD=$(password) postgres
		# Wait till posgres is listening
		while (! (: </dev/tcp/localhost/5432) &> /dev/null); do sleep 0.5; done
		# our database creates a user at startup, so we should simulate that too:
		psql --host=localhost --username=bugbounty -c "CREATE ROLE leastprivilegeuser LOGIN PASSWORD 'test';"

.PHONY: migration
migration:
		migrate create -ext sql -dir migrations -seq $(name)

.PHONY: migrate
migrate:
		migrate -database $(DATABASE_URL) -path migrations $(direction)

.PHONY: itstop
itstop:
		docker stop $$(docker ps -q)
