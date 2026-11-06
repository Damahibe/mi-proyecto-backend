const { Project, User, UserProject } = require('../models');

// 1. Crear Proyecto
exports.createProject = async (nombre, descripcion, admin_from_token) => {
  try {
    return await Project.create({
      nombre,
      descripcion,
      administrador_id: admin_from_token
    });
  } catch (err) {
    throw new Error(`Error al crear el proyecto: ${err.message}`);
  }
};

// 2. Obtener Proyectos por Administrador
exports.getAllProjectsByAdministradorId = async (admin_from_token) => {
  try {
    return await Project.findAll({
      where: { administrador_id: admin_from_token },
      include: [{
        model: User,
        as: 'usuarios',
        attributes: { exclude: ['password'] },
        through: { attributes: [] }
      }]
    });
  } catch (err) {
    throw new Error(`Error al consultar proyectos: ${err.message}`);
  }
};

// 3. Obtener Proyecto por ID
exports.getProjectById = async (id, admin_from_token) => {
  try {
    const project = await Project.findByPk(id, {
      include: [{
        model: User,
        as: 'usuarios',
        attributes: { exclude: ['password'] },
        through: { attributes: [] }
      }]
    });

    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (project.administrador_id !== admin_from_token) {
      const err = new Error('Acceso denegado a este proyecto');
      err.statusCode = 403;
      throw err;
    }

    return project;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 4. Obtener Proyectos por Usuario ID
exports.getProjectsByUserId = async (usuario_id) => {
  try {
    const user = await User.findByPk(usuario_id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Project,
        as: 'proyectos',
        through: { attributes: [] }
      }]
    });

    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }

    return user.proyectos;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 5. Asignar Usuario a Proyecto
exports.assignUserToProject = async (proyecto_id, usuario_id, admin_from_token) => {
  try {
    const project = await Project.findByPk(proyecto_id);
    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (project.administrador_id !== admin_from_token) {
      const err = new Error('Acceso denegado, no administra este proyecto');
      err.statusCode = 403;
      throw err;
    }

    const user = await User.findByPk(usuario_id);
    if (!user) {
      const err = new Error('Usuario a asignar no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const exists = await UserProject.findOne({
      where: { proyecto_id, usuario_id }
    });

    if (exists) {
      const err = new Error('El usuario ya está asignado a este proyecto');
      err.statusCode = 400;
      throw err;
    }

    await UserProject.create({
      proyecto_id,
      usuario_id
    });

    return { message: 'Usuario asignado exitosamente al proyecto' };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 6. Remover Usuario de Proyecto
exports.removeUserFromProject = async (proyecto_id, usuario_id, admin_from_token) => {
  try {
    const project = await Project.findByPk(proyecto_id);
    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (project.administrador_id !== admin_from_token) {
      const err = new Error('Acceso denegado, no administra este proyecto');
      err.statusCode = 403;
      throw err;
    }

    const assignment = await UserProject.findOne({
      where: { proyecto_id, usuario_id }
    });

    if (!assignment) {
      const err = new Error('La asignación no existe');
      err.statusCode = 404;
      throw err;
    }

    await assignment.destroy();
    return { message: 'Usuario removido exitosamente del proyecto' };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 7. Actualizar Proyecto
exports.updateProject = async (id, nombre, descripcion, admin_from_token) => {
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (project.administrador_id !== admin_from_token) {
      const err = new Error('Acceso denegado para modificar este proyecto');
      err.statusCode = 403;
      throw err;
    }

    await project.update({
      nombre: nombre !== undefined ? nombre : project.nombre,
      descripcion: descripcion !== undefined ? descripcion : project.descripcion
    });

    return project;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 8. Eliminar Proyecto
exports.deleteProject = async (id, admin_from_token) => {
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (project.administrador_id !== admin_from_token) {
      const err = new Error('Acceso denegado para eliminar este proyecto');
      err.statusCode = 403;
      throw err;
    }

    await UserProject.destroy({ where: { proyecto_id: id } });
    await project.destroy();

    return { message: 'Proyecto eliminado exitosamente' };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};
