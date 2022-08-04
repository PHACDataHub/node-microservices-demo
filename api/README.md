# API

This API only accepts [GraphQL](https://graphql.org/) queries as inputs (via HTTP GET request with a query param or a POST body). 
It's only outputs are JSON.

While GraphQL was [designed to solve mobile data fetching](https://youtu.be/783ccP__No8?t=112) for Facebook, it implements the [patterns for secure input handling](https://langsec.org/papers/curing-the-vulnerable-parser.pdf) advocated by the [Language Theoretic Security (LangSec)](http://langsec.org/spw21/) community. This ([and composition](https://www.youtube.com/watch?v=QrEOvHdH2Cg)) makes GraphQL an attractive choice for API development. 

[Principled use of GraphQL](https://www.youtube.com/watch?v=gqvyCdyp3Nw) places the GraphQL parser between the systems business logic and the input, which as interesting security properties as pointed out by [Momot, Falcon, et al.](http://langsec.org/papers/langsec-cwes-secdev2016.pdf):

> A correctly written parser is essentially equivalent to an application firewall.

This isn't a surprising for those familiar with LangSec and it's techniques. LangSec is [productised by security vendors](https://www.imperva.com/resources/datasheets/Imperva_RASP_Capability_Brief.pdf), [funded by DARPA to secure critical document formats](https://www.pdfa.org/safedocs-latest-research-into-securing-pdf/) and used to [secure security products](https://www.youtube.com/watch?v=HRv190R4gL8&t=665s). 

Applications directly using LangSec patterns/insights seems like the logical next step, since it allows for low cost, consistent security across all environments, ending the reliance on expensive, distant network devices for input filtering.  

## Installing dependencies

```bash
npm install
```

That's it!

## Running it
The API expects a `.env` file in the root of the `api` folder which can be populated with the following test values.
```bash
$ cat .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=bugbounty
DB_PASS=test
DB_NAME=bugbounty
MAX_COMPLEXITY=1000
```
After that you can run it and verify it's serving test data with [curl](https://curl.se/) and [jq](https://stedolan.github.io/jq/).
```bash
$ # Run a database
$ docker run -d --network host -e POSTGRES_USER=bugbounty -e POSTGRES_PASSWORD=test postgres
$ npm start &
$ curl -s -H "Content-Type: application/json" -d '{"query":"{bugs {id title}}"}' localhost:3000 | jq .
{
  "data": {
    "bugs": [
      {
        "id": "1",
        "title": "Reflective XSS found on customer support page"
      }
    ]
  }
}
```

## Running the tests

```bash
npm t
```

## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
