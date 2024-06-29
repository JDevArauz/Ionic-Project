const {  models, Sequelize } = require('../libs/sequelize');

class T_Asignacion_IncidenciaService {

    constructor() {}

    async find(query) {
      const res = await models.T_Asignacion_Incidencia.findAll({where: query});
      return res;
    }

    async findOne(id) {
      const res = await models.T_Asignacion_Incidencia.findByPk(id);
      return res;
    }

    async findTecnicosMenorIncidencias() {
      try {
        const usuarios = await models.T_Usuario.findAll({
          where: {
            CN_ID_Rol: 4, // Filtrar por el rol específico (ajusta el valor según tu necesidad)
          },
          attributes: [
            'CN_ID_Usuario',
            'CT_Nombre',
            [Sequelize.fn('COUNT', Sequelize.col('asignaciones.CN_ID_Incidente')), 'incidenciaCount'],
          ],
          include: [
            {
              model: models.T_Asignacion_Incidencia,
              as: 'asignaciones',
              attributes: [],
              required: false, // Usamos left join para incluir usuarios sin incidencias asignadas
            },
          ],
          group: ['CN_ID_Usuario'],
          order: [
            [Sequelize.literal('incidenciaCount'), 'ASC'], // Ordenar por la cantidad de incidencias ascendente
          ],
        });

        return usuarios;
      } catch (error) {
        console.error('Error al obtener los usuarios por rol y asignaciones:', error);
        throw error;
      }
    }

    async create(data) {
      const res = await models.T_Asignacion_Incidencia.create(data);
      return res;
    }

    async update(id, data) {
      const model = await this.findOne(id);
      const res = await model.update(data);
      return res;
    }

    async delete(id) {
      const model = await this.findOne(id);
      await model.destroy();
      return { deleted: true };
    }

  }

  module.exports = T_Asignacion_IncidenciaService;
