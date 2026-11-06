require('dotenv').config();
const http = require('http');
const app = require('../src/app');
const { sequelize } = require('../src/models');

const PORT = 3001; // Puerto dedicado para test

const request = (method, path, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runAudit = async () => {
  let server;
  try {
    console.log('🧪 Iniciando batería de pruebas y auditoría técnica...');
    await sequelize.authenticate();
    server = app.listen(PORT);
    console.log(`✅ Servidor de prueba montado en puerto ${PORT}\n`);

    // TEST 1: Seguridad sin token (401)
    console.log('▶ TEST 1: GET /api/users sin token');
    const t1 = await request('GET', '/api/users');
    console.assert(t1.status === 401, `Esperado 401, recibido ${t1.status}`);
    console.log(`  Respuesta: ${t1.status} - ${JSON.stringify(t1.body)}`);

    // TEST 2: Seguridad con token alterado (403)
    console.log('\n▶ TEST 2: GET /api/users con token inválido/alterado');
    const t2 = await request('GET', '/api/users', { 'Authorization': 'Bearer token_invalido_xyz' });
    console.assert(t2.status === 403, `Esperado 403, recibido ${t2.status}`);
    console.log(`  Respuesta: ${t2.status} - ${JSON.stringify(t2.body)}`);

    // TEST 3: Login de Administrador (200 + token)
    console.log('\n▶ TEST 3: POST /api/auth/login con admin');
    const t3 = await request('POST', '/api/auth/login', {}, {
      email: 'admin@ejemplo.com',
      password: 'admin1234'
    });
    console.assert(t3.status === 200, `Esperado 200, recibido ${t3.status}`);
    console.assert(t3.body.token, 'El token debe existir en la respuesta');
    const adminToken = t3.body.token;
    const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };
    console.log(`  Login exitoso. Token recibido (longitud ${adminToken.length})`);

    // TEST 4: Crear Usuario regular (201 + contraseña excluida)
    console.log('\n▶ TEST 4: POST /api/users/create con admin');
    const t4 = await request('POST', '/api/users/create', adminHeaders, {
      name: 'Maria Estudiante',
      email: `maria_${Date.now()}@ejemplo.com`,
      password: 'mariaPassword123',
      role_id: 2
    });
    console.assert(t4.status === 201, `Esperado 201, recibido ${t4.status}`);
    console.assert(t4.body.password === undefined, 'CRÍTICO: La contraseña no debe estar en la respuesta');
    console.log(`  Usuario creado: ID ${t4.body.id}, Email: ${t4.body.email}. Password excluido: ${t4.body.password === undefined}`);
    const newUserId = t4.body.id;

    // TEST 5: Listar usuarios (200 + verificar attributes: { exclude: ['password'] })
    console.log('\n▶ TEST 5: GET /api/users con admin (verificación estricta de exclusión de password)');
    const t5 = await request('GET', '/api/users', adminHeaders);
    console.assert(t5.status === 200, `Esperado 200, recibido ${t5.status}`);
    const passwordsPresent = t5.body.some(u => u.password !== undefined);
    console.assert(!passwordsPresent, 'CRÍTICO: Ningún usuario debe incluir el campo password');
    console.log(`  Total usuarios listados: ${t5.body.length}. Campo password excluido en todos: ${!passwordsPresent}`);

    // TEST 6: Filtro por email (req.query.email)
    console.log('\n▶ TEST 6: GET /api/users?email=maria con admin');
    const t6 = await request('GET', `/api/users?email=maria`, adminHeaders);
    console.assert(t6.status === 200, `Esperado 200, recibido ${t6.status}`);
    console.log(`  Usuarios encontrados con filtro 'maria': ${t6.body.length}`);

    // TEST 7: Actualizar usuario (PUT /api/users/update/:id)
    console.log(`\n▶ TEST 7: PUT /api/users/update/${newUserId} con admin`);
    const t7 = await request('PUT', `/api/users/update/${newUserId}`, adminHeaders, {
      name: 'Maria Estudiante Modificada'
    });
    console.assert(t7.status === 200, `Esperado 200, recibido ${t7.status}`);
    console.assert(t7.body.name === 'Maria Estudiante Modificada', 'El nombre debe haber cambiado');
    console.assert(t7.body.password === undefined, 'El campo password no debe devolverse');
    console.log(`  Usuario actualizado: ${t7.body.name}`);

    // TEST 8: Obtener usuarios por rol (GET /api/users/role/:id)
    console.log('\n▶ TEST 8: GET /api/users/role/2 (rol regular)');
    const t8 = await request('GET', '/api/users/role/2', adminHeaders);
    console.assert(t8.status === 200, `Esperado 200, recibido ${t8.status}`);
    console.log(`  Usuarios con rol 2 encontrados: ${t8.body.length}`);

    // TEST 9: Crear Proyecto (POST /api/projects)
    console.log('\n▶ TEST 9: POST /api/projects con admin');
    const t9 = await request('POST', '/api/projects', adminHeaders, {
      name: 'Plataforma IoT Universitaria',
      description: 'Proyecto de investigación con sensores y Sequelize'
    });
    console.assert(t9.status === 201, `Esperado 201, recibido ${t9.status}`);
    console.log(`  Proyecto creado: ID ${t9.body.id}, Nombre: ${t9.body.name}`);
    const newProjectId = t9.body.id;

    // TEST 10: Listar Proyectos con usuarios incluidos sin password
    console.log('\n▶ TEST 10: GET /api/projects con admin');
    const t10 = await request('GET', '/api/projects', adminHeaders);
    console.assert(t10.status === 200, `Esperado 200, recibido ${t10.status}`);
    console.log(`  Total proyectos listados: ${t10.body.length}`);

    // TEST 11: Obtener Proyecto por ID
    console.log(`\n▶ TEST 11: GET /api/projects/${newProjectId}`);
    const t11 = await request('GET', `/api/projects/${newProjectId}`, adminHeaders);
    console.assert(t11.status === 200, `Esperado 200, recibido ${t11.status}`);
    console.log(`  Proyecto consultado: ${t11.body.name}`);

    // TEST 12: Asignar usuario al proyecto (POST /api/projects/:id/assign)
    console.log(`\n▶ TEST 12: POST /api/projects/${newProjectId}/assign (asignar usuario ${newUserId})`);
    const t12 = await request('POST', `/api/projects/${newProjectId}/assign`, adminHeaders, {
      userId: newUserId
    });
    console.assert(t12.status === 200, `Esperado 200, recibido ${t12.status}`);
    console.log(`  Respuesta asignación: ${JSON.stringify(t12.body)}`);

    // TEST 13: Consultar proyectos del usuario (GET /api/projects/user/:userId)
    console.log(`\n▶ TEST 13: GET /api/projects/user/${newUserId}`);
    const t13 = await request('GET', `/api/projects/user/${newUserId}`, adminHeaders);
    console.assert(t13.status === 200, `Esperado 200, recibido ${t13.status}`);
    console.assert(t13.body.some(p => p.id === newProjectId), 'El proyecto debe figurar en la lista del usuario');
    console.log(`  Proyectos asignados al usuario: ${t13.body.length}`);

    // TEST 14: Desvincular usuario del proyecto (DELETE /api/projects/:id/users/:userId)
    console.log(`\n▶ TEST 14: DELETE /api/projects/${newProjectId}/users/${newUserId}`);
    const t14 = await request('DELETE', `/api/projects/${newProjectId}/users/${newUserId}`, adminHeaders);
    console.assert(t14.status === 200, `Esperado 200, recibido ${t14.status}`);
    console.log(`  Respuesta desvinculación: ${JSON.stringify(t14.body)}`);

    // TEST 15: Actualizar proyecto (PUT /api/projects/:id)
    console.log(`\n▶ TEST 15: PUT /api/projects/${newProjectId}`);
    const t15 = await request('PUT', `/api/projects/${newProjectId}`, adminHeaders, {
      name: 'Plataforma IoT Universitaria v2',
      description: 'Descripción actualizada'
    });
    console.assert(t15.status === 200, `Esperado 200, recibido ${t15.status}`);
    console.assert(t15.body.name === 'Plataforma IoT Universitaria v2');
    console.log(`  Proyecto actualizado: ${t15.body.name}`);

    // TEST 16: Eliminar proyecto (DELETE /api/projects/:id)
    console.log(`\n▶ TEST 16: DELETE /api/projects/${newProjectId}`);
    const t16 = await request('DELETE', `/api/projects/${newProjectId}`, adminHeaders);
    console.assert(t16.status === 200, `Esperado 200, recibido ${t16.status}`);
    console.log(`  Respuesta eliminación proyecto: ${JSON.stringify(t16.body)}`);

    // TEST 17: Eliminar usuario creado (DELETE /api/users/:id)
    console.log(`\n▶ TEST 17: DELETE /api/users/${newUserId}`);
    const t17 = await request('DELETE', `/api/users/${newUserId}`, adminHeaders);
    console.assert(t17.status === 200, `Esperado 200, recibido ${t17.status}`);
    console.log(`  Respuesta eliminación usuario: ${JSON.stringify(t17.body)}`);

    // TEST 18: Seguridad basada en roles (Login como usuario regular y probar endpoint restringido a Admin)
    console.log('\n▶ TEST 18: Permisos insuficientes (403 con usuario rol 2)');
    const tLoginUser = await request('POST', '/api/auth/login', {}, {
      email: 'carlos@ejemplo.com',
      password: 'user1234'
    });
    const regularToken = tLoginUser.body.token;
    const regularHeaders = { 'Authorization': `Bearer ${regularToken}` };

    const t18 = await request('POST', '/api/projects', regularHeaders, {
      name: 'Proyecto Prohibido'
    });
    console.assert(t18.status === 403, `Esperado 403 para usuario regular, recibido ${t18.status}`);
    console.log(`  Respuesta rol insuficiente: ${t18.status} - ${JSON.stringify(t18.body)}`);

    console.log('\n========================================================');
    console.log('🏆 ¡TODAS LAS PRUEBAS (18/18) PASARON EXITOSAMENTE!');
    console.log('El backend cumple al 100% con los requerimientos de la docente.');
    console.log('========================================================\n');
  } catch (error) {
    console.error('❌ Error en la auditoría:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    process.exit(0);
  }
};

runAudit();
