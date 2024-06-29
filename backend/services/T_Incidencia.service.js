const { models, sequelize, Sequelize } = require('../libs/sequelize');
const { Op } = Sequelize; // Importar Op desde Sequelize

class T_IncidenciaService {

    constructor() {}

    async find() {
      const res = await models.T_Incidencia.findAll();
      return res;
    }

    async findID(id) {
      const res = await models.T_Incidencia.findByPk(id);
      return res;
    }

    async findOne(query) {
      const res = await models.T_Incidencia.findAll({where: query,include: [
        { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
        { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
        { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
        { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
        { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
    ]});
      return res;
    }

    async findNoAssign() {
      try {
        const res = await models.T_Incidencia.findAll({
          include: [
            {
              model: models.T_Asignacion_Incidencia,
              as: 'T_Asignacion_Incidencium',
              required: false, // LEFT JOIN
            },
            { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
            { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
            { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
            { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
            { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
          ],
          where: {
            '$T_Asignacion_Incidencium.CN_ID_Asignacion$': {
              [Op.is]: null
            }
          }
        });

        return res;
      } catch (error) {
        console.error('Error al buscar incidencias no asignadas:', error);
        throw error;
      }
    }

    async findEnded() {
      try {
        const res = await models.T_Incidencia.findAll({
          where: {
            CN_ID_Estado_Incidencia: 9 // Aquí asumimos que 3 es el ID del estado "terminado"
          },
          include: [
            { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
            { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
            { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
            { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
            { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
          ]
        });
        return res;
      } catch (error) {
        console.error('Error al buscar incidencias terminadas:', error);
        throw error;
      }
    }

    async findAssignedByUser(CN_ID_Usuario_Asignador) {
      try {
        const res = await models.T_Incidencia.findAll({
          include: [
            {
              model: models.T_Asignacion_Incidencia,
              as: 'T_Asignaciones',
              where: {
                CN_ID_Usuario: CN_ID_Usuario_Asignador // Filtrar por el usuario asignador
              }
            }
          ]
        });
        return res;
      } catch (error) {
        console.error('Error al buscar incidencias asignadas por un usuario:', error);
        throw error;
      }
    }

    async create(data) {
      const res = await models.T_Incidencia.create(data);
      return res;
    }

    async update(id, data) {
      try {
        // Busca el registro que se va a actualizar por su ID
        const incidencia = await models.T_Incidencia.findByPk(id);

        if (!incidencia) {
          throw new Error(`No se encontró la incidencia con ID ${id}`);
        }

        // Actualiza el registro con los datos proporcionados
        const updatedIncidencia = await incidencia.update(data);

        return updatedIncidencia;
      } catch (error) {
        throw new Error(`Error al actualizar la incidencia: ${error.message}`);
      }
    }

    async delete(id) {
      const model = await this.findOne(id);
      await model.destroy();
      return { deleted: true };
    }

    async findByEstadoPrioridad(CN_ID_Estado_Incidencia, CN_ID_Prioridad_Incidencia) {
      let whereClause = {};

      // Verificar si ambos parámetros están presentes
      if (CN_ID_Estado_Incidencia !== undefined && CN_ID_Prioridad_Incidencia !== undefined) {
        // Si ambos están presentes, la consulta será estricta
        whereClause = {
          CN_ID_Estado_Incidencia: CN_ID_Estado_Incidencia,
          CN_ID_Prioridad_Incidencia: CN_ID_Prioridad_Incidencia
        };
      } else {
        // Si uno o ambos están ausentes, la consulta será más flexible
        if (CN_ID_Estado_Incidencia !== undefined) {
          whereClause.CN_ID_Estado_Incidencia = CN_ID_Estado_Incidencia;
        }
        if (CN_ID_Prioridad_Incidencia !== undefined) {
          whereClause.CN_ID_Prioridad_Incidencia = CN_ID_Prioridad_Incidencia;
        }
      }
      const res = await models.T_Incidencia.findAll({ where: whereClause,
        include: [
        { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
        { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
        { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
        { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
        { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
    ] });
      return res;
    }


    async findByIdOrUsuario(CN_ID_Incidente, CN_ID_Usuario) {
      let whereQuery = {};
      if (CN_ID_Incidente) {
        whereQuery.CN_ID_Incidente = CN_ID_Incidente;
      } else if (CN_ID_Usuario) {
        whereQuery.CN_ID_Usuario = CN_ID_Usuario;
      }

      const res = await models.T_Incidencia.findAll({
        where: whereQuery,
        include: [
          { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
          { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
          { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
          { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
          { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
      ]
      });

      return res;
    }

    async findByFilters() {
      try {
        // Obtener técnicos con incidentes pendientes (estado menor a 8)
        const tecnicosPendientes = await this.obtenerTecnicosPendientes();

        // Obtener técnicos con incidentes resueltos (estado igual a 8)
        const tecnicosResueltos = await this.obtenerTecnicosResueltos();

        // Consolidar resultados
        const tecnicosConsolidados = await this.consolidarTecnicos(tecnicosPendientes, tecnicosResueltos);

        // Obtener nombres de técnicos
        await Promise.all(tecnicosConsolidados.map(async (tecnico) => {
          const user = await models.T_Usuario.findOne({
            attributes: ['CN_ID_Usuario', 'CT_Nombre'],
            where: { CN_ID_Usuario: tecnico.CN_ID_Usuario }
          });
          tecnico.nombre = user?.CT_Nombre || 'Desconocido'; // Asignar nombre o un valor por defecto si no se encuentra
        }));

        return tecnicosConsolidados;
      } catch (error) {
        console.error('Error fetching tecnicos con incidentes:', error);
        throw error;
      }
    }


    async obtenerTecnicosPendientes() {
      try {
        const tecnicosPendientes = await models.T_Asignacion_Incidencia.findAll({
          attributes: [
            'CN_ID_Usuario',
            [Sequelize.fn('COUNT', Sequelize.col('T_Incidencia.CN_ID_Incidente')), 'totalPendientes']
          ],
          include: [
            {
              model: models.T_Incidencia,
              as: 'T_Incidencia',
              attributes: []
            },
            {
              model: models.T_Usuario,
              as: 'T_Usuario',
              attributes: [],
              include: [
                {
                  model: models.T_Rol_Usuario,
                  as: 'roles',
                  where: { CN_ID_Rol: 4 },
                  attributes: []
                }
              ]
            }
          ],
          where: {
            '$T_Incidencia.CN_ID_Estado_Incidencia$': {
              [Op.lt]: 8
            }
          },
          group: ['CN_ID_Usuario'],
          order: [[Sequelize.literal('totalPendientes'), 'DESC']]
        });

        return tecnicosPendientes;
      } catch (error) {
        console.error('Error fetching tecnicos pendientes:', error);
        throw error;
      }
    }

    async obtenerTecnicosResueltos() {
      try {
        const tecnicosResueltos = await models.T_Asignacion_Incidencia.findAll({
          attributes: [
            'CN_ID_Usuario',
            [Sequelize.fn('COUNT', Sequelize.col('T_Incidencia.CN_ID_Incidente')), 'totalResueltos']
          ],
          include: [
            {
              model: models.T_Incidencia,
              as: 'T_Incidencia',
              attributes: []
            },
            {
              model: models.T_Usuario,
              as: 'T_Usuario',
              attributes: [],
              include: [
                {
                  model: models.T_Rol_Usuario,
                  as: 'roles',
                  where: { CN_ID_Rol: 4 },
                  attributes: []
                }
              ]
            }
          ],
          where: {
            '$T_Incidencia.CN_ID_Estado_Incidencia$': 8
          },
          group: ['CN_ID_Usuario'],
          order: [[Sequelize.literal('totalResueltos'), 'DESC']]
        });

        return tecnicosResueltos;
      } catch (error) {
        console.error('Error fetching tecnicos resueltos:', error);
        throw error;
      }
    }

    consolidarTecnicos(tecnicosPendientes, tecnicosResueltos) {
      const tecnicosMap = new Map();

      // Procesar técnicos con incidentes pendientes
      tecnicosPendientes.forEach(item => {
        const { CN_ID_Usuario, totalPendientes } = item.toJSON();
        if (!tecnicosMap.has(CN_ID_Usuario)) {
          tecnicosMap.set(CN_ID_Usuario, {
            CN_ID_Usuario,
            totalPendientes: parseInt(totalPendientes, 10) || 0,
            totalResueltos: 0,
            nombre: '' // Inicializar el nombre como una cadena vacía
          });
        } else {
          tecnicosMap.get(CN_ID_Usuario).totalPendientes += parseInt(totalPendientes, 10) || 0;
        }
      });

      // Procesar técnicos con incidentes resueltos
      tecnicosResueltos.forEach(item => {
        const { CN_ID_Usuario, totalResueltos } = item.toJSON();
        if (tecnicosMap.has(CN_ID_Usuario)) {
          tecnicosMap.get(CN_ID_Usuario).totalResueltos += parseInt(totalResueltos, 10) || 0;
        } else {
          tecnicosMap.set(CN_ID_Usuario, {
            CN_ID_Usuario,
            totalPendientes: 0,
            totalResueltos: parseInt(totalResueltos, 10) || 0,
            nombre: '' // Inicializar el nombre como una cadena vacía
          });
        }
      });

      // Convertir el Map en un array de objetos
      const tecnicosArray = Array.from(tecnicosMap.values());

      return tecnicosArray;
    }



  }

  module.exports = T_IncidenciaService;
