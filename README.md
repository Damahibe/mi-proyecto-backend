# API Backend - Gestión de Usuarios y Proyectos (Segundo Corte Evaluativo)

**Docente:** Juliana Gómez Osorio  
**Asignatura:** Desarrollo Backend / Programación Web  
**Repositorio:** [https://github.com/Damahibe/mi-proyecto-backend.git](https://github.com/Damahibe/mi-proyecto-backend.git)  

---

## 📋 Resumen del Proyecto

Este proyecto backend implementa una arquitectura multicapa en **Node.js** con **Express**, autenticación y autorización mediante **JSON Web Tokens (JWT)**, persistencia relacional con **PostgreSQL** y el ORM **Sequelize**. Cumple con el 100% de las directrices y rúbricas evaluativas del Segundo Corte:

* **Seguridad Robusta:** Autenticación JWT (`Authorization: Bearer <token>`), control de acceso basado en roles (RBAC: `1 = Admin`, `2 = User`) y middleware centralizado de manejo de errores HTTP.
* **Exclusión Estricta de Contraseñas:** En todas las consultas y respuestas de la base de datos se excluye el atributo `password` (`attributes: { exclude: ['password'] }`).
* **CRUD Completo de Usuarios:** Creación, consulta por admin, búsqueda por rol, filtro dinámico por email (`req.query.email`), actualización con validación de unicidad y eliminación con validación de propiedad.
* **CRUD Completo de Proyectos (8 Servicios):**
  1. `createProject`: Creación vinculada al admin autenticado.
  2. `getProjects`: Listado con usuarios asignados (sin contraseñas).
  3. `getProjectById`: Búsqueda por ID y validación de propiedad.
  4. `getProjectsByUserId`: Consulta de proyectos de un usuario específico.
  5. `assignUserToProject`: Registro en tabla intermedia `UserProject`.
  6. `removeUserFromProject`: Desvinculación de tabla intermedia.
  7. `updateProject`: Modificación con verificación de pertenencia.
  8. `deleteProject`: Eliminación física con limpieza en cascada.

---

## 🛠️ Tecnologías Empleadas

* **Runtime:** Node.js (v20+)
* **Framework Web:** Express.js
* **Base de Datos:** PostgreSQL 16
* **ORM:** Sequelize v6
* **Criptografía y Seguridad:** `jsonwebtoken`, `bcryptjs`
* **Herramientas de Desarrollo:** `nodemon`, `dotenv`, `cors`, `morgan`
* **Pruebas y Demostración:** Postman (Colección v2.1 y Entorno preconfigurados)

---

## 🚀 Puesta en Marcha Rápida

### 1. Clonar el repositorio y entrar al proyecto
```bash
git clone https://github.com/Damahibe/mi-proyecto-backend.git
cd mi-proyecto-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (`.env`)
Crear el archivo `.env` en la raíz (puedes basarte en `.env.example`):
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

> **Nota:** La clave `JWT_SECRET` fue generada con 64 caracteres hexadecimales para cumplir con la máxima robustez criptográfica exigida.

### 4. Semillero de Datos (Seed Inicial)
Ejecuta el script para sincronizar las tablas en PostgreSQL y generar los usuarios de prueba:
```bash
npm run seed
```

**Credenciales iniciales generadas:**
* **Administrador (Rol 1):** `admin@ejemplo.com` / `admin1234`
* **Usuario Regular (Rol 2):** `carlos@ejemplo.com` / `user1234`

### 5. Iniciar Servidor en Modo Desarrollo
```bash
npm run dev
```
Verás en consola:
```text
========================================================
✅ PostgreSQL conectado exitosamente
✅ Sequelize sincronizado con la base de datos
🚀 Servidor escuchando en http://localhost:3000
📌 Base URL para Postman: http://localhost:3000/api
========================================================
```

### 6. Ejecutar Batería de Pruebas Automatizadas
```bash
npm test
```
Ejecuta 18 pruebas integrales verificando códigos de respuesta 401, 403, 200, 201 y la estricta ausencia del campo `password`.

---

## 📡 Matriz de Endpoints de la API (`baseUrl = http://localhost:3000/api`)

| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Público | Autenticación con JWT (payload incluye id, email, role_id) |
| **POST** | `/auth/register` | Público | Registro de usuario público inicial |
| **GET** | `/users` | Admin (1), User (2) | Listado de usuarios del admin (excluye `password`). Soporta `?email=` |
| **POST** | `/users/create` | Solo Admin (1) | Creación de usuario regular (`password` hasheado y excluido en respuesta) |
| **GET** | `/users/:id` | Admin (1), User (2) | Obtener usuario por ID (excluye `password`) |
| **GET** | `/users/role/:id` | Admin (1), User (2) | Búsqueda de usuarios filtrados por `role_id` |
| **PUT** | `/users/update/:id` | Solo Admin (1) | Actualización de usuario (valida propiedad y unicidad de email) |
| **DELETE**| `/users/:id` | Solo Admin (1) | Eliminación de usuario y sus asignaciones |
| **POST** | `/projects` | Solo Admin (1) | Creación de proyecto asociado al administrador autenticado |
| **GET** | `/projects` | Admin (1), User (2) | Listar proyectos del admin con usuarios asociados (`through: []`) |
| **GET** | `/projects/:id` | Admin (1), User (2) | Búsqueda por clave primaria y verificación de acceso |
| **GET** | `/projects/user/:userId` | Admin (1), User (2) | Listado de proyectos vinculados a un usuario específico |
| **POST** | `/projects/:id/assign` | Solo Admin (1) | Asignar usuario al proyecto (registra en `UserProject`) |
| **DELETE**| `/projects/:id/users/:userId` | Solo Admin (1) | Desvincular usuario del proyecto |
| **PUT** | `/projects/:id` | Solo Admin (1) | Modificación de proyecto comprobando existencia y propiedad |
| **DELETE**| `/projects/:id` | Solo Admin (1) | Eliminación de proyecto y sus asignaciones |

---

## 📬 Pruebas en Postman

En la carpeta `postman/` se incluyen:
1. `Segundo_Corte_Evaluativo.postman_collection.json`: 19 peticiones organizadas y comentadas.
2. `Segundo_Corte_Local.postman_environment.json`: Variables globales preconfiguradas.

### Script Automático de Token en Postman
En la pestaña **Tests** de la petición `POST {{baseUrl}}/auth/login`:
```javascript
const response = pm.response.json();
if (response.token) {
    pm.collectionVariables.set("adminToken", response.token);
    console.log("Token JWT guardado automáticamente en adminToken");
}
```

---

## 🎥 Guion para el Video Explicativo

Consulta el archivo detallado [`GUION_VIDEO_SEGUNDO_CORTE.md`](./GUION_VIDEO_SEGUNDO_CORTE.md) para la secuencia exacta de 6:45 minutos exigida por la docente.
