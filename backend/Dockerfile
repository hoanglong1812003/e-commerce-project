FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN mkdir -p uploads && chown -R node:node /app

USER node
ENV NODE_ENV=production
EXPOSE 4000

# Applies any pending migrations, then starts the API.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
