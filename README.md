# API Backend - Gestión de Usuarios y Proyectos (Segundo Corte Evaluativo)

**Docente:** Juliana Gómez Osorio  
**Asignatura:** Desarrollo Backend / Programación Web  
**Repositorio Oficial:** [https://github.com/Damahibe/mi-proyecto-backend.git](https://github.com/Damahibe/mi-proyecto-backend.git)  
**Directorio de Trabajo:** `admin-access-project-backend` / `mi-proyecto-backend`  

---

## 📋 Resumen del Proyecto

Este proyecto backend implementa una arquitectura en capas en **Node.js** con **Express**, autenticación y autorización mediante **JSON Web Tokens (JWT)**, persistencia relacional con **PostgreSQL** y el ORM **Sequelize**. Cumple con el 100% de las convenciones y rúbricas del Segundo Corte Evaluativo dictado por la docente Juliana Gómez Osorio:

* **Prefijo Oficial de Rutas:** Todas las rutas están montadas bajo `/api/v1` (`baseUrl = http://localhost:3000/api/v1/`).
* **Seguridad y Middlewares Oficiales:**
  * `src/middleware/auth.middleware.js`: Extrae `Authorization: Bearer <token>`, retorna **401** si no hay token y **403** si el token es inválido o expira.
  * `src/middleware/checkRole.middleware.js`: Valida permisos basados en roles (`1 = ADMIN`, `2 = USER`).
  * `src/middleware/error.middleware.js`: Middleware global de 4 parámetros para respuestas de error uniformes.
* **Nomenclatura y Esquema Relacional (`snake_case`):**
  * Campos y parámetros: `rol_id`, `administrador_id`, `admin_from_token`, `nombre`, `descripcion`, `proyecto_id`, `usuario_id`, `email`, `password`.
* **Exclusión Estricta de Contraseñas:** `attributes: { exclude: ['password'] }` en todas las consultas de lectura.
* **Módulo de Usuarios (`user.service.js`, `user.controller.js`, `user.routes.js`):**
  * `createUser`: Hashea la contraseña con `bcryptjs` y la excluye de la respuesta.
  * `updateUser`: Valida existencia previa con `User.findByPk(id)` antes de leer propiedades (evita caídas por `null`), valida pertenencia al administrador y unicidad de correo.
  * `getAllUsersByAdministradorId`: Filtrado por admin y soporte opcional de filtro por email (`req.query.email`).
  * `getAllUsersByRolId`: Búsqueda por rol específico.
  * `deleteUser`: Validación de existencia y permisos antes de eliminar.
* **Módulo de Proyectos (`project.service.js`, `project.controller.js`, `project.routes.js`):**
  * Los 8 servicios requeridos:
    1. `createProject`
    2. `getAllProjectsByAdministradorId` (asociación `usuarios` sin contraseña)
    3. `getProjectById`
    4. `getProjectsByUserId` (asociación `proyectos`)
    5. `assignUserToProject` (tabla intermedia `user_projects`)
    6. `removeUserFromProject`
    7. `updateProject`
    8. `deleteProject`

---

## 🚀 Puesta en Marcha Rápida

### 1. Entrar al proyecto e instalar dependencias
```bash
cd ~/.gemini/antigravity/scratch/mi-proyecto-backend
npm install
```

### 2. Configurar variables de entorno (`.env`)
El archivo `.env` está en la raíz (ignorado por `.gitignore`):
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=proyectos_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=faaa23c6598a78f5aeb0f9b9d362cf3d73c4d7dd394a8e2993483cf8eb60d43d
NODE_ENV=development
```

### 3. Semillero de Datos (Seed Inicial)
Sincroniza las tablas en PostgreSQL con campos en snake_case y datos de prueba:
```bash
npm run seed
```

**Credenciales iniciales:**
* **Administrador (Rol 1):** `admin@ejemplo.com` / `admin1234`
* **Usuario Regular (Rol 2):** `carlos@ejemplo.com` / `user1234`
* **Usuario Prueba Postman (Rol 2, ID 19):** `user19@ejemplo.com` / `user1234`

### 4. Iniciar Servidor
```bash
npm run dev
```
Consola:
```text
========================================================
✅ PostgreSQL conectado exitosamente
✅ Sequelize sincronizado con la base de datos
🚀 Servidor escuchando en http://localhost:3000
📌 Base URL para Postman: http://localhost:3000/api/v1/
========================================================
```

### 5. Batería de Pruebas Automatizadas
```bash
npm test
```
Ejecuta 18 pruebas verificando códigos 200, 201, 401, 403 y exclusión de contraseña bajo `/api/v1`.

---

## 📡 Matriz de Endpoints (`baseUrl = http://localhost:3000/api/v1/`)

| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Público | Autenticación con JWT (payload con id, email, rol_id) |
| **POST** | `/auth/register` | Público | Registro de usuario |
| **POST** | `/users/create` | Solo Admin (1) | Crear usuario regular (contraseña encriptada y excluida) |
| **PUT** | `/users/update/:id` | Solo Admin (1) | Actualizar usuario (valida existencia y propiedad) |
| **GET** | `/users` | Solo Admin (1) | Listar usuarios del admin (soporta `?email=`) |
| **DELETE**| `/users/delete/:id` | Solo Admin (1) | Eliminar usuario del administrador |
| **GET** | `/users/role/:id` | Solo Admin (1) | Listar usuarios por rol |
| **POST** | `/projects` | Solo Admin (1) | Crear proyecto vinculado a admin_from_token |
| **GET** | `/projects` | Admin (1), User (2) | Listar proyectos con relación `usuarios` (sin password) |
| **GET** | `/projects/:id` | Admin (1), User (2) | Obtener proyecto por ID |
| **GET** | `/projects/user/:userId` | Admin (1), User (2) | Listar proyectos asignados con relación `proyectos` |
| **POST** | `/projects/:id/assign` | Solo Admin (1) | Asignar usuario a proyecto en tabla intermedia |
| **DELETE**| `/projects/:id/users/:userId` | Solo Admin (1) | Remover usuario de proyecto |
| **PUT** | `/projects/:id` | Solo Admin (1) | Actualizar proyecto |
| **DELETE**| `/projects/:id` | Solo Admin (1) | Eliminar proyecto y asignaciones |

---

## 📬 Colección de Postman

Importa en Postman el archivo:
* `postman/Backend_Proyecto_Postman_FINAL.postman_collection.json`
* `postman/Segundo_Corte_Local.postman_environment.json`

Estructurado en las 3 carpetas exigidas:
1. `01 - AUTENTICACION`
2. `02 - CRUD USUARIOS - ADMIN`
3. `03 - CRUD PROYECTOS + ASOCIACIONES`

### Script de Autoguardado en `01 - Login ADMIN`:
```javascript
const data = pm.response.json();
const token = data.token || data.accessToken || data.data?.token || data.data?.accessToken;
if (token) pm.collectionVariables.set('adminToken', token);
else console.log('No se encontro token: ', data);
```

---

## 🎥 Guion para el Video

Revisa [`GUION_VIDEO_SEGUNDO_CORTE.md`](./GUION_VIDEO_SEGUNDO_CORTE.md) para la secuencia exacta de 0:00 a 6:45 minutos.
