# Stage 1 - Build
FROM node:18 AS build

WORKDIR /app

# RUN npm install -g pnpm@8.15.4

COPY package.json ./
RUN npm i

COPY . .
RUN npm run build

# Stage 2 - Serve
FROM node:18-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]