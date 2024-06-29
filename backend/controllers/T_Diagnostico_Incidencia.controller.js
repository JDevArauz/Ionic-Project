const T_Diagnostico_IncidenciaService = require('../services/T_Diagnostico_Incidencia.service');
const service = new T_Diagnostico_IncidenciaService();

const create = async ( req, res ) => {
    try {
        const response = await service.create(req.body);
        res.json({ success: true, data: response});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const get = async ( req, res ) => {
    try {
        const response = await service.find();
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getByIdOrUsuario = async (req, res) => {
  try {
    const { CN_ID_Incidente , CN_ID_Usuario  } = req.query;
    const response = await service.findByIdOrUsuario(CN_ID_Incidente , CN_ID_Usuario );
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const response = await service.findOne({CN_ID_Usuario: id});
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await service.update(id,body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

module.exports = {
    create, get, getById,getByIdOrUsuario , update, _delete
};
