# Node microservices demo

This is a small demo of fine grained services and their security properties. Code is written in JavaScript/[Node.js](https://nodejs.org). Similar demos with Python and R are planned.

## Wait why? A brief detour into policy...

TBS has been pushing hard to modernize IT practices. It's [Enterprise Architecture Framework](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html) explains:
> Application architecture practices must evolve significantly for the successful implementation of the GC Enterprise Ecosystem Target Architecture. Transitioning from legacy systems based on monolithic architectures to architectures that oriented around business services and based on re‑useable components implementing business capabilities, is a major shift.

This mandatory policy is aggressively modern and directs departments to 
* "design systems as highly modular and loosely coupled services"
* "use distributed architectures"
* "support zero-downtime deployments"
* "expose services, including existing ones, through APIs"
* "ensure automated testing occurs"
* "design for cloud mobility"

The shift to highly available and [evolvable](https://www.amazon.ca/Building-Evolutionary-Architectures-Support-Constant/dp/1491986360/ref=sr_1_1) [distributed systems](https://www.freecodecamp.org/news/a-thorough-introduction-to-distributed-systems-3b91562c9b3c) is strategically important to support modern service delivery, but it's easy to overlook that building and supporting such systems is very different from what the government is used to. Distributed systems are [complex](https://how.complexsystems.fail) and [hard](https://www.youtube.com/watch?v=w9GP7MNbaRc).

What's missing to help departments adapt to this "major shift" are working examples of how to build this type of architecture. That is the aim of this project.

## This demo

A distributed system is made of many small (micro even!) parts (services) that collaborate to deliver some funtionality. As is common with microservices projects, this repository is organized in the [monorepo](https://en.wikipedia.org/wiki/Monorepo) style keeping services in it's own folder.

All code embeds opinions, and this repo and the code within are no exception. There are [other options](https://www.serverless.com/framework/docs/getting-started) worth exploring, but the patterns and technologies here come from balancing a lot of tradeoffs specific to service delivery in the Government of Canada.

The code and readme files make special note of [the security properties that emerge from this style of architecture](https://www.youtube.com/watch?v=VaE3jLPB4zU).

## The API Service

Since [APIs are mandatory](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#toc04:~:text=expose%20services%2C%20including%20existing%20ones%2C%20through%20APIs), the API forms a core part of this service. Living in the API folder, this is a [GraphQL](https://graphql.org) API that reads from/writes to tables in the database, and produces only JSON as an output. It's narrow scope allows for tightly scoped database permissions, and makes security profiling of "normal" behaviour tractable.

See the [API documentation](api/README.md) for more details.

## The Migrations service

This lives in the migrations folder and exists to move the database schema from one known state to the next.

The powerful permissions needed to alter a database schema (ie create/drop tables) are required only once at startup, and it's the job of the migration service to create/verify the schema needed and then exit.
This design leverages the plumbing provided by modern container orchestrators like [ECS](https://twitter.com/nathankpeck/status/1104069162949849092) or [Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#understanding-init-containers) to achieve "least privilege".

See the [Migrations documentation](migrations/README.md) for more details.

## The UI service

Found in the ui folder, this service queries the API and is focused on [safely encoding](https://youtu.be/NcAYsC_TKCA?t=642) the data received into accessible HTML using [React](https://reactjs.org/).

See the [UI documentation](ui/README.md) for more details.

## Running it

Distributed architectures require an [orchestrator](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications), and Kubernetes is a vendor neutral open source stadard. You can run a local version of it using [Minikube](https://minikube.sigs.k8s.io/docs/). Minikube requires a lot of resources... so throw everything you can at it.

```bash
minikube start --cpus 8 --memory 20480
make credentials
make demo
```
