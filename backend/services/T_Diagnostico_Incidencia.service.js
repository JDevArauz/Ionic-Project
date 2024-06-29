const { models } = require('../libs/sequelize');

class T_Diagnostico_IncidenciaService {

    constructor() {}

    async find() {
      const res = await models.T_Diagnostico_Incidencia.findAll({include: [
        {
            model: models.T_Incidencia,
            include: [
                { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
                { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
                { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
                { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
                { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
            ]
        }
    ]}
      );
      return res;
    }

    async findOne(query) {
      const res = await models.T_Diagnostico_Incidencia.findAll({where: query,
        include: [
          {
              model: models.T_Incidencia,
              include: [
                  { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
                  { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
                  { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
                  { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
                  { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
              ]
          }
      ]
      });
      return res;
    }

    async create(data) {
      const res = await models.T_Diagnostico_Incidencia.create(data);
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

    async findByIdOrUsuario(CN_ID_Incidente, CN_ID_Usuario) {
      let whereQuery = {};
      if (CN_ID_Incidente) {
          whereQuery.CN_ID_Incidente = CN_ID_Incidente;
      } else if (CN_ID_Usuario) {
          whereQuery.CN_ID_Usuario = CN_ID_Usuario;
      }

      const res = await models.T_Diagnostico_Incidencia.findAll({
          where: whereQuery,
          include: [
              {
                  model: models.T_Incidencia,
                  include: [
                      { model: models.T_Estado, as: 'T_Estado', attributes: ['CT_Descripcion'] },
                      { model: models.T_Prioridad, as: 'T_Prioridad', attributes: ['CT_Descripcion'] },
                      { model: models.T_Riesgo, as: 'T_Riesgo', attributes: ['CT_Descripcion'] },
                      { model: models.T_Afectacion, as: 'T_Afectacion', attributes: ['CT_Descripcion'] },
                      { model: models.T_Categoria, as: 'T_Categoria', attributes: ['CT_Descripcion'] }
                  ]
              }
          ]
      });

      return res;
  }

  }

  module.exports = T_Diagnostico_IncidenciaService;
