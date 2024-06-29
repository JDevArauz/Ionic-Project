const express = require('express');
const jwt = require('jsonwebtoken');
const T_UsuarioService = require('./T_Usuario.service');
const service = new T_UsuarioService();

const token = express.Router();

token.post('/', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign({
      CN_ID_Usuario: user.CN_ID_Usuario,
      CT_Nombre: user.CT_Nombre,
      CN_ID_Rol: user.CN_ID_Rol
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  });
});

module.exports = token;
