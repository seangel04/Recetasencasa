# Recetasencasa

Página web local de recetas de cocina.

- El **administrador** inicia sesión y agrega recetas a un *banco de recetas*.
- Desde un **calendario** estilo Google Calendar, arrastra recetas a los días (máximo una por día).
- La **cocinera** entra sin cuenta y ve únicamente la receta asignada al día de hoy.

Hecho con Next.js 16, Prisma 7 + SQLite, NextAuth y @dnd-kit.

---

## Desarrollo local

```bash
npm install
npx prisma generate
npx prisma db push      # crea prisma/dev.db
npm run dev             # http://localhost:3000
```

Variables en un archivo `.env` (ver `.env.example`).

---

## Despliegue con Docker Compose (para el VPS)

La base de datos **no** está en el repositorio: se crea automáticamente al
levantar los contenedores y se guarda en el volumen `./data`. Las fotos que
suba el administrador también persisten en `./data/recipes`.

```bash
# 1. clonar el repositorio en el VPS
git clone https://github.com/seangel04/Recetasencasa.git
cd Recetasencasa

# 2. configurar los secretos
cp .env.example .env
nano .env                       # cambia NEXTAUTH_SECRET y la contraseña del admin

# 3. construir y levantar
docker compose up -d --build
```

La app queda en `http://<ip-del-vps>:3000`.

| Acción | Comando |
|---|---|
| Ver logs | `docker compose logs -f` |
| Detener | `docker compose down` |
| Actualizar tras un `git pull` | `docker compose up -d --build` |

Los datos sobreviven a `docker compose down` porque viven en `./data`
(en el host, fuera del contenedor).
