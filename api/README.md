# Node Demo

A simple API demonstrating some security practices.

## Installing dependencies

```bash
npm install
```

That's it!

## Running it

```bash
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
