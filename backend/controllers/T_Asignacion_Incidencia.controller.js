const T_Asignacion_IncidenciaService = require('../services/T_Asignacion_Incidencia.service');
const service = new T_Asignacion_IncidenciaService();
const T_IncidenciaService = require('../services/T_Incidencia.service');
const incidenciaService = new T_IncidenciaService();

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

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener asignaciones por usuario
    const asignaciones = await service.find({ CN_ID_Usuario: id });

    // Obtener detalles de las incidencias para cada asignación
    const incidenciasPromises = asignaciones.map(async (asignacion) => {
      const incidencia = await incidenciaService.findOne(asignacion.CN_ID_Incidente);
      return { ...asignacion, incidencia };
    });
    // Esperar a que todas las promesas se resuelvan
    const response = await Promise.all(incidenciasPromises);

    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getTecnicosMenorIncidencias = async (req, res) => {
  try {
    const response = await service.findTecnicosMenorIncidencias();
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
    create, get, getById,getTecnicosMenorIncidencias, update, _delete
};
