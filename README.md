# Node microservices demo

This is a small demo of fine grained services and their security properties. Code is written in JavaScript/[Node.js](https://nodejs.org). Similar demos with Python and R are planned.

## Wait why? A brief detour into policy...

TBS has been pushing hard to modernize IT practices. It's [Enterprise Architecture Framework](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html) explains:
> Application architecture practices must evolve significantly for the successful implementation of the GC Enterprise Ecosystem Target Architecture. Transitioning from legacy systems based on monolithic architectures to architectures that oriented around business services and based on re‑useable components implementing business capabilities, is a major shift.

This mandatory policy is aggressively modern and directs departments to 
* "[design systems as highly modular and loosely coupled services](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=design%20systems%20as%20highly%20modular%20and%20loosely%20coupled%20services)"
* "[use distributed architectures](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=use%20distributed%20architectures)"
* "[support zero-downtime deployments](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=support%20zero%E2%80%91downtime%20deployments)"
* "[expose services, including existing ones, through APIs](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=expose%20services%2C%20including%20existing%20ones%2C%20through%20APIs)"
* "[ensure automated testing occurs](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=ensure%20automated%20testing%20occurs)"
* "[design for cloud mobility](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=design%20for%20cloud%20mobility)"
* [validate APIs by consuming what you build](https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/government-canada-standards-apis.html#:~:text=Consume%20what%20you%20build)

The shift to highly available and [evolvable](https://www.amazon.ca/Building-Evolutionary-Architectures-Support-Constant/dp/1491986360/ref=sr_1_1) [distributed systems](https://www.freecodecamp.org/news/a-thorough-introduction-to-distributed-systems-3b91562c9b3c) is strategically important to support modern service delivery, but it's easy to overlook that building and supporting such systems is very different from the [3-tier architecture](https://www.gartner.com/en/documents/3352423) that most departments have standardized on. 
Distributed systems are [complex](https://how.complexsystems.fail) and [hard](https://www.youtube.com/watch?v=w9GP7MNbaRc) and building them requires different [structures](https://teamtopologies.com/key-concepts), tools and [patterns](https://microservices.io/).

What's missing to help departments adapt to this "major shift" are working examples of how to build this type of architecture. That is the aim of this project.

## This demo

A distributed system is made of many small (micro even!) parts (services) that collaborate to deliver some funtionality, deployed across a series of machines. The most basic verion of this architecture comes from splitting a classic MVC-style monolith in two. The result: An API developed together with an application that consumes it. [Just like Treasury Board requires](https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/government-canada-standards-apis.html#:~:text=The%20best%20way%20to%20validate%20your%20API%20design%20is%20to%20consume%20it%20with%20a%20production%20application%20within%20your%20organization.).

The basic idea behind this demo is to show an example of this way of building and deploying applications and demonstrate how it allows for better security boundaries, and more granular security decisions. It also allows for higher levels of observability, as can been seen when we visualize traffic flowing through these services with [Kiali](https://kiali.io/).

![microservices-kiali](https://user-images.githubusercontent.com/109692/191849626-bd14c426-d536-4fbc-8bb0-fad20d5f2d5e.gif)

Visualizations like the above are a powerful way to make security visible: you can see that the system has distinct components (with their own security settings), and communications between them is encrypted with mTLS. 

This is a zero trust microcosm, and systems built like this have [security properties](https://www.youtube.com/watch?v=_omGtDfaAjI) and [compliance implications](https://www.youtube.com/watch?v=WgSMaiCaBpw&t=2162s) that security teams need to be learning about.

As is common with microservices projects, this repository is organized in the [monorepo](https://en.wikipedia.org/wiki/Monorepo) style keeping services in it's own folder (code that changes together stays together).

All code embeds opinions, and this repo and the code within are no exception. There are [other options](https://www.serverless.com/framework/docs/getting-started) worth exploring, but the patterns and technologies here come from balancing a lot of tradeoffs specific to service delivery in the Government of Canada.

The code and readme files make special note of [the security properties that emerge from this style of architecture](https://www.youtube.com/watch?v=VaE3jLPB4zU).

## The API Service

Since [APIs are mandatory](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#toc04:~:text=expose%20services%2C%20including%20existing%20ones%2C%20through%20APIs), the API forms a core part of this service. Living in the API folder, this is a [GraphQL](https://graphql.org) API that reads from/writes to tables in the database, and produces only JSON as an output. It's narrow scope allows for tightly scoped database permissions, and makes security profiling of "normal" behaviour tractable.

While The TBS Standard on APIs says that APIs should use REST "[by default](https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/government-canada-standards-apis.html#:~:text=APIs%20must%20follow%20the%20RESTful%20model%20by%20default.)", this demo extercises the latitude to go beyond the default (it's been confirmed with TBS this is allowed) and use GraphQL because [it allows for composition](https://www.apollographql.com/docs/federation/federated-types/composition/). Services built with composition in mind turn themselves into building blocks that can be combined in various ways to allow the organization as a whole to quickly adapt to shifting demands (hence calls for a "[composable enterprise](https://www.gartner.com/en/doc/465932-future-of-applications-delivering-the-composable-enterprise)").

See the [API documentation](api/README.md) for more details.

## The Migrations service

This lives in the migrations folder and exists to move the database schema from one known state to the next. The requirement to "[support zero-downtime deployments](https://www.canada.ca/en/government/system/digital-government/policies-standards/government-canada-enterprise-architecture-framework.html#:~:text=support%20zero%E2%80%91downtime%20deployments)" means teams will need to look carefully at how to do this with their choosen database and web framework (and possibly choose ones that make this easy to do).

The powerful permissions needed to alter a database schema (ie create/drop tables) are required only once at startup, and it's the job of the migration service to create/verify the schema needed and then exit.
This design leverages the plumbing provided by modern container orchestrators like [ECS](https://twitter.com/nathankpeck/status/1104069162949849092) or [Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#understanding-init-containers) to achieve "least privilege".

See the [Migrations documentation](migrations/README.md) for more details.

## The UI service

Found in the ui folder, this service queries the API and is focused on [safely encoding](https://youtu.be/NcAYsC_TKCA?t=642) the data received into accessible HTML using [React](https://react.dev/). This approach means that teams with varying skill levels can reliably produce UI that is free from Cross Site-Scripting vulnerabilities (aka XSS). Using React also makes it possible to leverage accessible-by-default components created by others (such as Microsoft's [Fluent UI](https://learn.microsoft.com/en-us/shows/fluent-ui-insights/fluent-ui-insights-accessible-by-default) components, Adobe's [React Aria](https://react-spectrum.adobe.com/react-aria/index.html), or community-led projects like [Radix-UI](https://www.radix-ui.com/)).
When devs are building with components that are both secure and accessible by default, organizations have the option of implementing lighter, faster process without worry that these requirements will not be met.     

See the [UI documentation](ui/README.md) for more details.

## Running it

Distributed architectures require an [orchestrator](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications), and Kubernetes is a vendor neutral open source orchestrator available in many form factors [from many vendors](https://www.cncf.io/training/certification/software-conformance/#logos) with [security sufficient for the US Air Force](https://thenewstack.io/how-the-u-s-air-force-deployed-kubernetes-and-istio-on-an-f-16-in-45-days/).

You can run a local version of it using [Minikube](https://minikube.sigs.k8s.io/docs/). Minikube requires a lot of resources... so throw everything you can at it.

For reference, this is what was used to develop this.
```bash
$ minikube config view
- cpus: 16
- memory: 40G

```

You'll also need [Kustomize](https://kustomize.io/) and [istioctl](https://istio.io/latest/docs/setup/getting-started/#download) installed.
Once you're all set run the following commands:

```bash
minikube start
make credentials
make demo
```

Then launch the Kiali dashboard:
```bash
istioctl dashboard kiali
```

Refresh the application several times to see traffic flow on the dashboard. The url can be found with:
```bash
minikube service istio-ingressgateway -n istio-system --url
```
