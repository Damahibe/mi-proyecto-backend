# Guion Técnico y Secuencial de Grabación (Segundo Corte Evaluativo)

**Docente:** Juliana Gómez Osorio  
**Asignatura:** Programación Backend / Web  
**Duración Total Estimada:** 6 minutos y 45 segundos  
**Colección Postman:** `Backend Proyecto - Postman FINAL`  
**Base URL:** `http://localhost:3000/api/v1/`  

---

## ⏱️ Minuto a Minuto de la Grabación

### 1. Arranque del Servidor (0:00 - 0:45)
* **Pantalla visible:** Terminal ejecutando `npm run dev` en pantalla dividida con VS Code.
* **Acción en vivo:**
  ```bash
  npm run dev
  ```
* **Qué decir/explicar:**
  > *"Muy buen día, profesora Juliana. A continuación presento la sustentación práctica del Segundo Corte Evaluativo de nuestro backend en Node.js, Express, Sequelize y PostgreSQL.*
  > *Como se observa en la terminal al ejecutar `npm run dev`, el servidor se conecta exitosamente a la base de datos PostgreSQL `proyectos_db`, Sequelize sincroniza automáticamente los modelos relacionales de Usuarios, Proyectos y la tabla intermedia UserProject con convención snake_case, y la API queda lista y escuchando en el puerto 3000 bajo el prefijo obligatorio `/api/v1`."*
* **Detalle visual:** Señalar con el cursor los mensajes de confirmación:
  * `✅ PostgreSQL conectado exitosamente`
  * `✅ Sequelize sincronizado con la base de datos`
  * `🚀 Servidor escuchando en http://localhost:3000`
  * `📌 Base URL para Postman: http://localhost:3000/api/v1/`

---

### 2. Demostración de Seguridad y Middlewares (0:45 - 1:30)
* **Pantalla visible:** Postman (Carpeta `02 - CRUD USUARIOS - ADMIN`).
* **Acción 1 (0:45 - 1:05):**
  * Abrir petición `01 - Acceso SIN Token (401 Unauthorized)`: `GET {{baseUrl}}users`.
  * Presionar **Send**.
  * **Qué decir:**
    > *"Iniciamos probando la capa de seguridad en nuestro middleware `auth.middleware.js`. Si intentamos acceder a una ruta protegida como `GET /api/v1/users` sin enviar la cabecera `Authorization`, el servidor responde inmediatamente con un código HTTP **401 Unauthorized** y el mensaje: 'Acceso denegado. No se proporcionó un token.'."*
* **Acción 2 (1:05 - 1:30):**
  * Abrir petición `02 - Acceso con Token Invalido (403 Forbidden)`.
  * Mostrar que tiene un Bearer Token alterado (`token_invalido_de_prueba`).
  * Presionar **Send**.
  * **Qué decir:**
    > *"Si enviamos un token alterado o con una firma inválida, `jwt.verify` captura la excepción y retorna un código HTTP **403 Forbidden** con el mensaje 'Token no válido o expirado.', comprobando la integridad criptográfica de nuestro JWT."*

---

### 3. Flujo de Autenticación y Autoguardado de Token (1:30 - 2:30)
* **Pantalla visible:** Postman (Carpeta `01 - AUTENTICACION`).
* **Acción 1:**
  * Abrir petición `01 - Login ADMIN`: `POST {{baseUrl}}auth/login`.
  * Mostrar el Body en JSON:
    ```json
    {
      "email": "admin@ejemplo.com",
      "password": "admin1234"
    }
    ```
  * Mostrar la pestaña **Tests** de Postman con el script de autoguardado:
    ```javascript
    const data = pm.response.json();
    const token = data.token || data.accessToken || data.data?.token || data.data?.accessToken;
    if (token) pm.collectionVariables.set('adminToken', token);
    else console.log('No se encontro token: ', data);
    ```
  * Presionar **Send**.
  * **Qué decir:**
    > *"Procedemos a la autenticación del Administrador. Enviamos sus credenciales a `POST /api/v1/auth/login`. El backend verifica la contraseña con `bcrypt`, genera el JWT firmado con nuestro secreto y responde con estado **200 OK**.*
    > *A través del script de pruebas en Postman, el token se captura automáticamente y se almacena en la variable de colección `adminToken`, permitiendo que todas las peticiones posteriores queden autorizadas de forma transparente."*
* **Acción 2:**
  * Ejecutar `02 - Login USUARIO REGULAR` -> Mostrar que autoguarda `userToken`.

---

### 4. Demostración del Módulo de Usuarios (2:30 - 4:00)
* **Pantalla visible:** Postman (Carpeta `02 - CRUD USUARIOS - ADMIN`).
* **Acción 1 (Crear Usuario):**
  * Abrir `03 - Crear Usuario (POST /users/create)`.
  * Presionar **Send**. Mostrar respuesta **201 Created**.
  * **Qué decir:**
    > *"Creamos un nuevo usuario mediante `POST /api/v1/users/create`. La contraseña se almacena hasheada con bcrypt en PostgreSQL y la respuesta HTTP ya la excluye por seguridad."*
* **Acción 2 (Listar y destacar exclusión de password):**
  * Abrir `04 - Listar Usuarios (Sin Password)`: `GET {{baseUrl}}users`.
  * Presionar **Send**. Mostrar respuesta **200 OK**.
  * **Qué decir:**
    > *"Hacemos un `GET /api/v1/users`. **Hago especial énfasis visual en que el campo `password` no aparece bajo ninguna circunstancia en la respuesta JSON**, cumpliendo con la directiva estricta de `attributes: { exclude: ['password'] }` en el servicio Sequelize."*
* **Acción 3 (Filtro por email y por rol):**
  * Abrir `05 - Listar Usuarios con Filtro Email` (`GET {{baseUrl}}users?email=carlos@ejemplo.com`) -> **Send**.
  * Abrir `06 - Obtener Usuarios por Rol` (`GET {{baseUrl}}users/role/2`) -> **Send**.
  * **Qué decir:**
    > *"Probamos los filtros especializados: búsqueda por correo electrónico y búsqueda por rol mediante `GET /api/v1/users/role/:id`."*
* **Acción 4 (Actualizar y Eliminar):**
  * Abrir `07 - Actualizar Usuario (PUT /users/update/:id)` -> **Send** (Respuesta 200 OK).
  * Abrir `08 - Eliminar Usuario (DELETE /users/delete/:id)` -> **Send** (Respuesta 200 OK).
  * **Qué decir:**
    > *"Actualizamos y eliminamos usuarios validando primero existencia previa y pertenencia al administrador autenticado para evitar caídas por registros nulos."*

---

### 5. Demostración del Módulo de Proyectos (4:00 - 6:00)
* **Pantalla visible:** Postman (Carpeta `03 - CRUD PROYECTOS + ASOCIACIONES`).
* **Acción 1 (Crear Proyecto):**
  * Abrir `01 - Crear Proyecto (POST /projects)`.
  * Presionar **Send**. Mostrar respuesta **201 Created** con el ID generado y `administrador_id` inyectado desde el token.
  * **Qué decir:**
    > *"Pasamos al módulo de proyectos con sus 8 métodos exigidos. Primero, creamos un proyecto con `POST /api/v1/projects`. El backend asocia automáticamente el proyecto al administrador extraído del token JWT."*
* **Acción 2 (Listar Proyectos):**
  * Abrir `02 - Listar Proyectos del Administrador`: `GET {{baseUrl}}projects`.
  * Presionar **Send**. Mostrar los proyectos y la relación `usuarios` (sin contraseñas).
  * **Qué decir:**
    > *"Con `GET /api/v1/projects` listamos los proyectos del administrador. Sequelize realiza un join hacia los usuarios asociados a través de la tabla intermedia `user_projects` bajo el alias 'usuarios', excluyendo siempre las contraseñas."*
* **Acción 3 (Asignar Usuario):**
  * Abrir `04 - Asignar Usuario a Proyecto`: `POST {{baseUrl}}projects/:id/assign`.
  * Presionar **Send**. Respuesta: `{"message": "Usuario asignado exitosamente al proyecto"}`.
  * **Qué decir:**
    > *"Asignamos un usuario al proyecto registrando la relación en la tabla intermedia y validando que no se creen asignaciones duplicadas."*
* **Acción 4 (Consultar Proyectos de Usuario):**
  * Abrir `05 - Obtener Proyectos por Usuario ID`: `GET {{baseUrl}}projects/user/:userId`.
  * Presionar **Send**.
  * **Qué decir:**
    > *"Consultamos los proyectos asociados a un usuario mediante `GET /api/v1/projects/user/:userId`, confirmando la relación muchos a muchos con el alias 'proyectos'."*
* **Acción 5 (Desvincular, Actualizar, Eliminar y Control de Roles):**
  * Abrir `06 - Remover Usuario de Proyecto` -> **Send** (Respuesta exitosa).
  * Abrir `07 - Actualizar Proyecto` -> **Send** (Proyecto modificado).
  * Abrir `08 - Eliminar Proyecto` -> **Send** (Proyecto eliminado en cascada).
  * Abrir `09 - Permisos Insuficientes (403 Forbidden)` -> **Send** (Demuestra que un usuario regular no puede crear proyectos).
  * **Qué decir:**
    > *"Verificamos la desvinculación, actualización, eliminación física controlada y el control de acceso RBAC, donde un usuario con rol 2 recibe código 403 al intentar crear proyectos."*

---

### 6. Verificación en Base de Datos y Repositorio (6:00 - 6:45)
* **Pantalla visible:** Consola `psql` o pgAdmin + navegador con GitHub.
* **Acción 1 (PostgreSQL):**
  * Mostrar las tablas `users`, `projects` y `user_projects` con sus campos en snake_case.
  * **Qué decir:**
    > *"Aquí en PostgreSQL podemos constatar la persistencia real de las tablas `users`, `projects` y `user_projects`, sus llaves foráneas y el password cifrado irreversiblemente."*
* **Acción 2 (Repositorio GitHub):**
  * Mostrar `https://github.com/Damahibe/mi-proyecto-backend`.
  * Mostrar los commits al día, el archivo `.env` ignorado por `.gitignore` y la documentación completa.
  * **Qué decir:**
    > *"Para finalizar, revisamos el repositorio oficial en GitHub con el código modularizado bajo `/api/v1` y los estándares de seguridad al día.*
    > *Con esto concluyo la sustentación del Segundo Corte. Muchas gracias profesora Juliana por su atención."*
