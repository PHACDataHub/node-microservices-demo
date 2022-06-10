# Node microservices demo

This is a small demo of the security properties of fine grained services written in Node.js. Similar demos with Python and R are planned.

The "service" is actually sliced into three separate parts each of which can be run with an appropriate level of permission, demonstrating the links between architecture, various technologies and security.

## Migrations

Permissions to change the database schema (ie create/drop tables) are required only once at startup, to put the database in a known state.
The API Migration service create/verifies the tables needed and then exits, a design that leverages the plumbing provided by modern container orchestrators like [ECS](https://twitter.com/nathankpeck/status/1104069162949849092) or [Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#understanding-init-containers) to achieve "least privilege".

## API

This is a [GraphQL](https://graphql.org) API that reads from/writes to tables in the database, and produces only JSON as an output. It's narrow scope allows for tightly scoped database permissions, and makes security profiling of "normal" behaviour tractable.

## UI

This service queries the API and is focused on [safely encoding](https://youtu.be/NcAYsC_TKCA?t=642) the data received into accessible HTML using [React](https://reactjs.org/).
