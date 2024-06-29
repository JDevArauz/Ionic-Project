const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser'); // Agrega esta línea

dotenv.config();
const app = express();
const APIRouter = require('./routes');
const PORT = process.env.PORT || 3000;

// Configurar middlewares
const corsOptions = {
  origin: '*', // Permitir todos los orígenes
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
  credentials: true, // Permitir envío de cookies
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // Agrega esta línea
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Routes
app.get('/api', (req, res) => {
  res.send('API funcionando correctamente');
});

APIRouter(app);

app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en el puerto ${PORT}`);
});
