# The showcase as a container (Coolify, docs/deploy.md): Node builds the static site, nginx serves it.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Public address (share tags) and where the site is served. The Umami id comes from .env.production.
ARG SITE_URL=https://mangacn.romain-sonnet.fr/
ARG BASE_PATH=/
ENV SITE_URL=$SITE_URL BASE_PATH=$BASE_PATH
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
