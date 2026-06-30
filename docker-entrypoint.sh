#!/bin/sh
set -e

echo "==> Creando/actualizando el esquema de la base de datos..."
# crea las tablas en la BD (si no existe el archivo, lo crea). el cliente ya
# se genero en el build, y prisma 7 quito el flag --skip-generate de db push
npx prisma db push

echo "==> Iniciando la aplicacion..."
exec "$@"
