const { models, sequelize, Sequelize } = require('../libs/sequelize');

class T_CategoriaService {

    constructor() {}

    async find() {
      const res = await models.T_Categoria.findAll();
      return res;
    }

    async findOne(id) {
      const res = await models.T_Categoria.findByPk(id);
      return res;
    }

    async create(data) {
      const res = await models.T_Categoria.create(data);
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

    async getAll() {
      const categorias = await models.T_Incidencia.findAll({
        attributes: [
          'CN_ID_Categoria_Incidencia',
          [Sequelize.fn('COUNT', Sequelize.col('CN_ID_Incidente')), 'cantidad']
        ],
        include: [
          {
            model: models.T_Categoria, as: 'T_Categoria',
            attributes: ['CN_ID_Categoria', 'CT_Descripcion']
          }
        ],
        group: ['CN_ID_Categoria'],
        order: [[Sequelize.literal('cantidad'), 'DESC']]
      });
      return categorias;
    }

  }

  module.exports = T_CategoriaService;
