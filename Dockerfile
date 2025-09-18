FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM node:24-alpine AS runner

RUN addgroup -S freelog && adduser -S freelog -G freelog

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

USER freelog

EXPOSE 8080
CMD ["node", "dist/index.js"]

