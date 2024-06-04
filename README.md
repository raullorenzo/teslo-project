# Description



## Levantar proyecto
1. Clonar repositorio
2. Crear una copia del ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Ejecutar las migraciones de Prisma ```npx prisma migrate dev```
6. Llenar la base de datos con nuestro seed ```npm run seed```
7. Limpiar el localStorage del navegador
8. Levantar el proyecto ```npm run dev```



## Levantar en producción
1.
2.
3.


## Table Plus extras

1. Entrar en table plus en nuestra bas de datos
2. command + t para abrir consola de sentencias sql

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started

Despues de crear nuevas relaciones en schema.prisma necesitamos crear una migración: ```npx prisma migrate dev --name ProductCategory```

generar el cliente: ```npx prisma generate```