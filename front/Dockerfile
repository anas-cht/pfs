# === Stage 1: Build React app ===
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN yarn install
COPY . .
RUN yarn build  # generates /app/dist


# === Stage 2: Serve with Nginx ===
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
