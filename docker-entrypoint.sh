#!/bin/sh
set -e

echo "==> Creando/actualizando el esquema de la base de datos..."
# crea las tablas en la BD (si no existe el archivo, lo crea) sin regenerar el cliente
npx prisma db push --skip-generate

echo "==> Iniciando la aplicacion..."
exec "$@"
