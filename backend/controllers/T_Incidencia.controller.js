const T_IncidenciaService = require('../services/T_Incidencia.service');
const service = new T_IncidenciaService();

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

const getFilteredIncidencias = async (req, res) => {
  try {
    const response = await service.findByFilters();
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const response = await service.findOne({CN_ID_Usuario: id});
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getId = async ( req, res ) => {
    try {
        const { id } = req.params;
        const response = await service.findID({CN_ID_Incidente: id});
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getNoAssign = async (req, res) => {
  try {
    const response = await service.findNoAssign();
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
const getByEstadoPrioridad = async (req, res) => {
  try {
    const { CN_ID_Estado_Incidencia, CN_ID_Prioridad_Incidencia } = req.query;
    const response = await service.findByEstadoPrioridad(CN_ID_Estado_Incidencia, CN_ID_Prioridad_Incidencia);
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getByIdOrUsuario = async (req, res) => {
  try {
    const { CN_ID_Incidente , CN_ID_Usuario  } = req.query;
    const response = await service.findByIdOrUsuario(CN_ID_Incidente , CN_ID_Usuario );
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
const getEnded = async (req, res) => {
  try {
    const response = await service.findEnded();
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getAssignedByUser = async (req, res) => {
  try {
    const { CN_ID_Usuario } = req.query;
    const response = await service.findAssignedByUser(CN_ID_Usuario);
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = {
    create, get, getById,getId, update, _delete, getByEstadoPrioridad, getByIdOrUsuario, getNoAssign, getEnded, getAssignedByUser, getFilteredIncidencias
};
