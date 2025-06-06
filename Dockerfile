# ==============================================================================
# ==============================================================================
# common
# ==============================================================================
# ==============================================================================
FROM node:22 AS common

USER root
RUN userdel -r node || true
RUN useradd -m -s /bin/bash urlshortener
USER urlshortener
RUN mkdir -p /home/urlshortener/.aws/

WORKDIR /app
RUN mkdir -p /app/logs
COPY package*.json ./

# ==============================================================================
# ==============================================================================
# dev
# ==============================================================================
# ==============================================================================
FROM common AS dev
# USER urlshortener
RUN npm ci
COPY --chown=urlshortener:urlshortener . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ==============================================================================
# ==============================================================================
# builder
# ==============================================================================
# ==============================================================================
FROM common AS builder
USER urlshortener
RUN npm ci
COPY --chown=urlshortener:urlshortener . .
RUN npm run clean
RUN npm run build

# ==============================================================================
# ==============================================================================
# production
# ==============================================================================
# ==============================================================================
FROM common AS prod
USER urlshortener
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.prod* ./
EXPOSE 3000
CMD ["npm", "run", "start"]
