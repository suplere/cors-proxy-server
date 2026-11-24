
FROM node:18 as builder
WORKDIR /app

RUN corepack enable pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY package.json ./
RUN pnpm install --offline

COPY ./ ./

RUN pnpm prune --prod

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js

EXPOSE 3000

CMD [ "node", "index.js" ]
