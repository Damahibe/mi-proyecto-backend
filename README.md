# mi-proyecto

Configuración inicial de un proyecto Backend con Node.js y Express, siguiendo las guías prácticas suministradas.

## 1. Requisitos

- Node.js y npm instalados.
- Git instalado.
- Visual Studio Code instalado.
- Cuenta de GitHub.

Versiones verificadas durante la práctica:

```text
Node.js v24.21.0
npm 11.19.0
Git 2.53.0.windows.3
```

## 2. Creación del proyecto

```powershell
mkdir mi-proyecto
cd mi-proyecto
npm init -y
```

## 3. Dependencias

```powershell
npm install express dotenv cors helmet morgan
npm install --save-dev nodemon
```

- `express`: creación de la API y manejo de rutas.
- `dotenv`: variables de entorno.
- `cors`: configuración de solicitudes desde otros orígenes.
- `helmet`: cabeceras HTTP de seguridad.
- `morgan`: registro de peticiones HTTP.
- `nodemon`: reinicio automático durante el desarrollo.

## 4. Estructura recomendada

```text
mi-proyecto/
├── node_modules/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

Las carpetas de `src` contienen `.gitkeep` mientras permanecen vacías, para que Git pueda registrarlas.

## 5. Variables de entorno

El archivo `.env` permanece fuera de Git y contiene la configuración de ejemplo indicada en la guía:

```dotenv
PORT=3000
DB_HOST=localhost
DB_NAME=mi_base_de_datos
DB_USER=postgres
DB_PASS=contraseña
```

No se deben publicar contraseñas ni credenciales reales.

## 6. Scripts

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

Los archivos `src/app.js` y `src/server.js` se crearon como componentes iniciales. Su implementación se realizará en una etapa posterior.

## 7. Git y GitHub

El archivo `.gitignore` excluye:

```text
node_modules/
.env
```

Comandos utilizados para preparar el repositorio local:

```powershell
git init
git branch -M main
git status
git add .
git commit -m "Configuración inicial del proyecto backend"
git remote add origin https://github.com/Damahibe/mi-proyecto-backend.git
git remote -v
```

El proyecto se subió a `Damahibe/mi-proyecto-backend` con:

```powershell
git push -u origin main
```
