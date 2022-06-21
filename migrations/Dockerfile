FROM migrate/migrate:v4.15.2 AS migrate
FROM alpine:3.14.4

RUN addgroup -S migrate && adduser -H -S migrate -G migrate

COPY --chown=migrate:migrate --from=migrate /usr/local/bin/migrate /usr/local/bin/migrate

COPY ./migrations /migrations
# Create a group and user
#
# Tell docker that all future commands should run as the migrate user
USER migrate

# Run in shell so variable expansion works.
CMD migrate -database=$DB_URL -path=/migrations up
