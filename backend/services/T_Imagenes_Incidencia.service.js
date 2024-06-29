const { models } = require('../libs/sequelize');

class T_Imagenes_IncidenciaService {

    constructor() {}

    async find(query) {
      const res = await models.T_Imagenes_Incidencia.findAll({ where: query });
      return res;
    }

    async findOne(id) {
      const res = await models.T_Imagenes_Incidencia.findByPk(id);
      return res;
    }

    async create(data) {
      const res = await models.T_Imagenes_Incidencia.create(data);
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

  module.exports = T_Imagenes_IncidenciaService;
