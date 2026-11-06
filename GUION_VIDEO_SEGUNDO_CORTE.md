# Guion Técnico y Secuencial de Grabación (Segundo Corte Evaluativo)

**Docente:** Juliana Gómez Osorio  
**Duración Total Estimada:** 6 minutos y 45 segundos  
**Objetivo:** Obtener la máxima calificación demostrando el funcionamiento riguroso del backend, la arquitectura en capas, la seguridad JWT, Sequelize/PostgreSQL y las pruebas completas en Postman.

---

## ⏱️ Minuto a Minuto de la Grabación

### 1. Arranque del Servidor (0:00 - 0:45)
* **Pantalla visible:** Terminal en pantalla completa o dividida con VS Code.
* **Acción en vivo:**
  ```bash
  npm run dev
  ```
* **Qué decir/explicar:**
  > *"Muy buen día, profesora Juliana. A continuación presento la sustentación y demostración técnica del Segundo Corte Evaluativo de nuestro backend en Node.js y Express con Sequelize y PostgreSQL.*
  > *Como se observa en la terminal al ejecutar `npm run dev`, el servidor se conecta exitosamente a la base de datos PostgreSQL `proyectos_db`, Sequelize sincroniza automáticamente los modelos relacionales de Usuarios, Proyectos y la tabla intermedia UserProject, y la API queda escuchando peticiones en el puerto 3000 con el prefijo `/api`."*
* **Detalle visual:** Señalar con el cursor los mensajes verdes de confirmación:
  * `✅ PostgreSQL conectado exitosamente`
  * `✅ Sequelize sincronizado con la base de datos`
  * `🚀 Servidor escuchando en http://localhost:3000`

---

### 2. Demostración de Seguridad y Middlewares (0:45 - 1:30)
* **Pantalla visible:** Postman (Carpeta `1. Seguridad (Middlewares)`).
* **Acción 1 (0:45 - 1:05):**
  * Abrir petición `01. Petición SIN Token (Espera 401 Unauthorized)`: `GET {{baseUrl}}/users`.
  * Presionar **Send**.
  * **Qué decir:**
    > *"Iniciamos probando la capa de seguridad en nuestro middleware `auth.middleware.js`. Si intentamos acceder a un recurso protegido como `GET /api/users` sin enviar la cabecera `Authorization`, el servidor rechaza inmediatamente la petición con un código HTTP **401 Unauthorized** y el mensaje: 'Acceso denegado. No se proporcionó un token.'."*
* **Acción 2 (1:05 - 1:30):**
  * Abrir petición `02. Petición con Token Inválido (Espera 403 Forbidden)`.
  * Mostrar que tiene un Bearer Token alterado (`token_invalido_o_corrupto_12345`).
  * Presionar **Send**.
  * **Qué decir:**
    > *"Ahora, si enviamos un token alterado, corrupto o con una firma que no coincide con nuestro secreto de 64 caracteres en `.env`, `jwt.verify` captura la excepción y retorna un código HTTP **403 Forbidden** con el mensaje 'Token no válido o expirado.'. Cumpliendo al 100% con la especificación de seguridad."*

---

### 3. Flujo de Autenticación y Autoguardado de Token (1:30 - 2:30)
* **Pantalla visible:** Postman (Carpeta `2. Autenticación (Auth)`).
* **Acción 1:**
  * Abrir petición `03. Login Admin (Autoguardado de adminToken)`: `POST {{baseUrl}}/auth/login`.
  * Mostrar el Body en JSON:
    ```json
    {
      "email": "admin@ejemplo.com",
      "password": "admin1234"
    }
    ```
  * Mostrar brevemente la pestaña **Tests** de Postman donde se encuentra el script:
    ```javascript
    const response = pm.response.json();
    if (response.token) {
        pm.collectionVariables.set("adminToken", response.token);
        console.log("Token JWT guardado automáticamente en adminToken");
    }
    ```
  * Presionar **Send**.
  * **Qué decir:**
    > *"Procedemos a la autenticación del Administrador. Enviamos sus credenciales a `POST /api/auth/login`. El backend verifica la contraseña con `bcrypt`, genera el JWT firmado con nuestro secreto y responde con estado **200 OK**.*
    > *Gracias al script de pruebas en Postman, el token se captura de la respuesta y se guarda automáticamente en la variable de colección `adminToken`, permitiendo que todas las peticiones posteriores estén autenticadas sin copiar y pegar manualmente."*
* **Detalle visual:** Abrir las variables de la colección o mostrar en consola que `adminToken` ahora tiene el token generado.

---

### 4. Demostración del Módulo de Usuarios (2:30 - 4:00)
* **Pantalla visible:** Postman (Carpeta `3. Módulo de Usuarios`).
* **Acción 1 (Crear Usuario):**
  * Abrir `05. Crear Usuario Regular (POST /users/create)`.
  * Presionar **Send**. Mostrar respuesta **201 Created**.
  * **Qué decir:**
    > *"Como primer paso del CRUD de Usuarios, creamos un nuevo usuario mediante `POST /api/users/create`. Notemos que la contraseña se encripta en base de datos y la respuesta HTTP ya la excluye por seguridad."*
* **Acción 2 (Listar y destacar exclusión de password):**
  * Abrir `06. Listar Usuarios (GET /users - Sin Contraseña)`.
  * Presionar **Send**. Mostrar respuesta **200 OK**.
  * **Qué decir:**
    > *"Hacemos un `GET /api/users`. **Hago especial énfasis visual en que el campo `password` no aparece bajo ninguna circunstancia en la respuesta JSON**, cumpliendo con la directiva estricta de `attributes: { exclude: ['password'] }` en el servicio Sequelize."*
* **Acción 3 (Actualizar Usuario):**
  * Abrir `07. Actualizar Usuario (PUT /users/update/:id)`.
  * Presionar **Send**. Mostrar respuesta **200 OK** con los datos modificados.
  * **Qué decir:**
    > *"Actualizamos los datos del usuario con `PUT /api/users/update/:id`. El servicio valida primero que el registro exista, que pertenezca al administrador autenticado y que si se cambia el correo, no colisione con otro usuario existente."*
* **Acción 4 (Filtro por rol y filtro por email):**
  * Abrir `08. Filtrar Usuarios por Rol (GET /users/role/2)` -> **Send** (muestra solo usuarios con rol 2).
  * Abrir `09. Filtrar Usuarios por Email (GET /users?email=carlos)` -> **Send** (muestra filtro dinámico con `Op.iLike`).
  * **Qué decir:**
    > *"Probamos los filtros especializados: búsqueda por rol mediante `GET /api/users/role/:id` y búsqueda por correo con `GET /api/users?email=...`, ambos operando de forma óptima."*

---

### 5. Demostración del Módulo de Proyectos (4:00 - 6:00)
* **Pantalla visible:** Postman (Carpeta `4. Módulo de Proyectos`).
* **Acción 1 (Crear Proyecto):**
  * Abrir `10. Crear Proyecto (POST /projects)`.
  * Presionar **Send**. Mostrar respuesta **201 Created** con el ID generado y el `administrador_id` inyectado desde el token.
  * **Qué decir:**
    > *"Pasamos al módulo de proyectos con sus 8 servicios exigidos. Primero, creamos un proyecto con `POST /api/projects`. El backend vincula automáticamente el proyecto al administrador extraído del token JWT."*
* **Acción 2 (Listar Proyectos):**
  * Abrir `11. Listar Proyectos del Administrador (GET /projects)`.
  * Presionar **Send**. Mostrar los proyectos y la inclusión de usuarios asignados.
  * **Qué decir:**
    > *"Con `GET /api/projects` listamos los proyectos del administrador. Sequelize realiza un join hacia los usuarios asociados a través de la tabla intermedia `UserProject`, excluyendo siempre las contraseñas."*
* **Acción 3 (Asignar Usuario):**
  * Abrir `13. Asignar Usuario a Proyecto (POST /projects/:id/assign)`.
  * Presionar **Send**. Respuesta: `{"message": "Usuario asignado exitosamente al proyecto"}`.
  * **Qué decir:**
    > *"Asignamos un usuario al proyecto con `POST /api/projects/:id/assign`. Se crea el registro correspondiente en la tabla intermedia validando que no exista una asignación duplicada."*
* **Acción 4 (Consultar Proyectos de Usuario):**
  * Abrir `14. Consultar Proyectos de un Usuario (GET /projects/user/:userId)`.
  * Presionar **Send**.
  * **Qué decir:**
    > *"Verificamos los proyectos de dicho usuario mediante `GET /api/projects/user/:userId`, confirmando la relación muchos a muchos bidireccional."*
* **Acción 5 (Desvincular y Actualizar/Eliminar):**
  * Abrir `15. Desvincular Usuario de Proyecto`: `DELETE /api/projects/:id/users/:userId` -> **Send** (Respuesta exitosa).
  * Abrir `16. Actualizar Proyecto`: `PUT /api/projects/:id` -> **Send** (Datos actualizados).
  * Abrir `17. Eliminar Proyecto`: `DELETE /api/projects/:id` -> **Send** (Proyecto eliminado limpiamente).
  * **Qué decir:**
    > *"Comprobamos los servicios restantes: desvinculación de usuarios, actualización de proyectos con verificación de propiedad y eliminación física controlada tanto del proyecto como de sus registros asociados."*

---

### 6. Verificación en Base de Datos y Repositorio (6:00 - 6:45)
* **Pantalla visible:** pgAdmin o consola `psql` + pestaña de navegador con GitHub.
* **Acción 1 (PostgreSQL / pgAdmin):**
  * Mostrar las tablas `users`, `projects`, `user_projects` con un simple `SELECT * FROM users;` o visualmente en pgAdmin.
  * **Qué decir:**
    > *"Aquí en la consola de PostgreSQL podemos constatar la persistencia real de las tablas `users`, `projects` y `user_projects`, sus llaves foráneas y la contraseña almacenada de forma irreversible con el hash de bcrypt."*
* **Acción 2 (Repositorio GitHub):**
  * Cambiar al navegador mostrando `https://github.com/Damahibe/mi-proyecto-backend`.
  * Mostrar que `.env` no está versionado (está en `.gitignore`), el README completo y los commits organizados.
  * **Qué decir:**
    > *"Finalmente, revisamos el repositorio oficial en GitHub. Se observa que el archivo `.env` está debidamente ignorado por seguridad en `.gitignore`, la documentación contiene la guía completa y el código modularizado está listo para producción.*
    > *Con esto concluyo la sustentación del Segundo Corte, habiendo cumplido satisfactoriamente con la totalidad de los criterios evaluativos. Muchas gracias profesora Juliana por su atención."*
