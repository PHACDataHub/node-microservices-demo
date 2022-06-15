# Node microservices demo

This is a small demo of the security properties of fine grained services written in Node.js. Similar demos with Python and R are planned.

## Wait why? A brief detour into policy...

TBS has been pushing hard to modernize IT practices. It's [Enterprise Architecture Framework](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html) explains:
> Application architecture practices must evolve significantly for the successful implementation of the GC Enterprise Ecosystem Target Architecture. Transitioning from legacy systems based on monolithic architectures to architectures that oriented around business services and based on re‑useable components implementing business capabilities, is a major shift.

This mandatory policy directs departments to "use distributed architectures" and "support zero‑downtime deployments" and to "ensure automated testing occurs".

What's missing to help departments adapt to this "major shift" are working examples of this type of architecture. That is the aim of this project.

## This demo

A distributed system is made of many small (micro even!) parts (services) that collaborate to deliver some funtionality. As is common with microservices projects, this repository is organized in the [monorepo](https://en.wikipedia.org/wiki/Monorepo) style keeping services in it's own folder.

The benefits of this approach is a system that can tolerate failures in various components without user visible interruptions.

Slicing what might have been one Monolithic application into parts doesn't just help availability, it provides some interesting security benefits as well: communication between parts can be visualized and controled, and each part can run with an appropriate level of permission, demonstrating interesting links between architecture and security.


## The Migrations service

This lives in the migrations folder and exists to move the database schema from one known state to the next.

Permissions to alter a database schema (ie create/drop tables) are required only once at startup, to put the database in a known state.
The API Migration service create/verifies the tables needed and then exits, a design that leverages the plumbing provided by modern container orchestrators like [ECS](https://twitter.com/nathankpeck/status/1104069162949849092) or [Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#understanding-init-containers) to achieve "least privilege".

## The API Service

Living in the API folder, this is a [GraphQL](https://graphql.org) API that reads from/writes to tables in the database, and produces only JSON as an output. It's narrow scope allows for tightly scoped database permissions, and makes security profiling of "normal" behaviour tractable.

## The UI service

Found in the ui folder, this service queries the API and is focused on [safely encoding](https://youtu.be/NcAYsC_TKCA?t=642) the data received into accessible HTML using [React](https://reactjs.org/).

## Running it

Distributed architectures require an orchestrator, and Kubernetes is a vendor neutral open source stadard. You can run a local version of it using [Minikube](https://minikube.sigs.k8s.io/docs/). Minikube requires a lot of resources... so throw everything you can at it.

```bash
minikube start --cpus 8 --memory 20480
make credentials
make demo
```
