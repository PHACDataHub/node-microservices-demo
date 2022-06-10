FROM node:18.3.0-alpine3.15 AS builder

COPY . /ui
WORKDIR /ui
RUN npm i && npm run build

FROM node:18.3.0-alpine3.15

RUN npm i --location=global serve
COPY --from=builder --chown=node:node /ui/build /ui
USER node
EXPOSE 3000
CMD ["serve", "-s", "ui"]
