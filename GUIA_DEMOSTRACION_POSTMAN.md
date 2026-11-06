# Guía Rápida para Importar y Utilizar Postman en la Sustentación

Esta guía te explica cómo cargar la colección y el entorno en Postman en menos de 1 minuto y dejarlos listos para la grabación de tu video.

---

## 📥 Paso 1: Importar Colección y Entorno en Postman

1. Abre **Postman**.
2. En la esquina superior izquierda, haz clic en el botón **Import**.
3. Arrastra o selecciona los dos archivos ubicados en la carpeta `postman/` del proyecto:
   * `postman/Segundo_Corte_Evaluativo.postman_collection.json`
   * `postman/Segundo_Corte_Local.postman_environment.json`
4. En la esquina superior derecha de Postman, selecciona el entorno activo: **Segundo Corte - Local Environment**.

---

## 🔑 Paso 2: Entender las Variables de Entorno y Colección

Las siguientes variables vienen preconfiguradas:

| Variable | Valor Inicial | Función |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:3000/api` | URL raíz de todos los endpoints |
| `adminEmail` | `admin@ejemplo.com` | Correo del Administrador de prueba |
| `adminPassword` | `admin1234` | Contraseña del Administrador |
| `adminToken` | *(Se llena solo)* | Token JWT extraído automáticamente tras el login |
| `userToken` | *(Se llena solo)* | Token JWT del usuario regular |
| `userId` | `2` | ID de usuario para pruebas de actualización/asignación |
| `projectId` | `1` | ID de proyecto para pruebas de actualización/asignación |

---

## ⚡ Paso 3: Cómo Funciona el Autoguardado del Token

Al ejecutar la petición **`03. Login Admin (Autoguardado de adminToken)`**, Postman ejecuta automáticamente el siguiente script en la pestaña **Tests**:

```javascript
const response = pm.response.json();
if (response.token) {
    pm.collectionVariables.set("adminToken", response.token);
    console.log("Token JWT guardado automáticamente en adminToken");
}
```

Esto inyecta el token en la variable `adminToken`. Como todas las peticiones protegidas tienen configurado:
* **Authorization:** `Bearer Token`
* **Token:** `{{adminToken}}`

¡No tienes que copiar ni pegar ningún token a mano durante la grabación del video!

---

## 🚀 Paso 4: Orden Exacto de Ejecución para el Video

Sigue simplemente las peticiones en orden numérico:

1. `01. Petición SIN Token (Espera 401 Unauthorized)` ➡️ Muestra código **401**
2. `02. Petición con Token Inválido (Espera 403 Forbidden)` ➡️ Muestra código **403**
3. `03. Login Admin (Autoguardado de adminToken)` ➡️ Muestra código **200** y genera token
4. `05. Crear Usuario Regular (POST /users/create)` ➡️ Muestra código **201**
5. `06. Listar Usuarios (GET /users - Sin Contraseña)` ➡️ Muestra código **200** y señala que **NO hay campo password**
6. `07. Actualizar Usuario (PUT /users/update/:id)` ➡️ Muestra código **200**
7. `08. Filtrar Usuarios por Rol (GET /users/role/2)` ➡️ Muestra código **200**
8. `10. Crear Proyecto (POST /projects)` ➡️ Muestra código **201**
9. `11. Listar Proyectos del Administrador (GET /projects)` ➡️ Muestra código **200** con usuarios
10. `13. Asignar Usuario a Proyecto (POST /projects/:id/assign)` ➡️ Muestra código **200**
11. `14. Consultar Proyectos de un Usuario (GET /projects/user/:userId)` ➡️ Muestra código **200**
12. `15. Desvincular Usuario de Proyecto` ➡️ Muestra código **200**
13. `16. Actualizar Proyecto` ➡️ Muestra código **200**
14. `17. Eliminar Proyecto` ➡️ Muestra código **200**
15. `19. Usuario Regular Creando Proyecto (Espera 403 Forbidden)` ➡️ Muestra código **403** demostrando control de roles
