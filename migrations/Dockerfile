FROM migrate/migrate:v4.15.2 AS migrate
FROM alpine:3.14.4

COPY --from=migrate /usr/local/bin/migrate /usr/local/bin/migrate

COPY ./migrations /migrations
# Create a group and user
RUN addgroup -S migrate && adduser -H -S migrate -G migrate
#
# Tell docker that all future commands should run as the migrate user
USER migrate

# Clobber the existing entrypoint:
ENTRYPOINT [""]
# Run in shell so variable expansion works.
CMD migrate -database=$DB_URL -path=/migrations up
