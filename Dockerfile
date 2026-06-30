# ---------- Etapa 1: build ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# herramientas para compilar better-sqlite3 (modulo nativo) y openssl para prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# instalar dependencias (capa cacheable)
COPY package.json package-lock.json* ./
RUN npm ci

# copiar el resto del codigo y compilar
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# copiar la app ya compilada (incluye node_modules con el CLI de prisma)
COPY --from=builder /app ./

# limpiar cualquier db creada durante el build y preparar carpetas para los volumenes
RUN rm -f /app/prisma/*.db* || true && mkdir -p /app/data /app/public/recipes

# entrypoint: crea/actualiza el esquema de la BD y arranca la app
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
