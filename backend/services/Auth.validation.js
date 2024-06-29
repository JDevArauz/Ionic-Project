const express = require('express');
const jwt = require('jsonwebtoken');
const T_UsuarioService = require('./T_Usuario.service');
const service = new T_UsuarioService();

const router = express.Router();

router.post('/', async (req, res) => {
  const { CT_Correo, CT_Contrasena } = req.body;

  try {
    const user = await service.findOne({ CT_Correo });
    if (!user || user.CT_Contrasena !== CT_Contrasena) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const accessToken = jwt.sign({
      CN_ID_Usuario: user.CN_ID_Usuario,
      CT_Nombre: user.CT_Nombre,
      CN_ID_Rol: user.CN_ID_Rol
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({
      CN_ID_Usuario: user.CN_ID_Usuario,
      CT_Nombre: user.CT_Nombre,
      CN_ID_Rol: user.CN_ID_Rol
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.json({
      accessToken,
      refreshToken,
      user: {
        CN_ID_Usuario: user.CN_ID_Usuario,
        CT_Nombre: user.CT_Nombre,
        CN_ID_Rol: user.CN_ID_Rol
      }
    });
  } catch (error) {
    console.error('Error al autenticar al usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
