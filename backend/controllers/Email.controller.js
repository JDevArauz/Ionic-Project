const nodemailer = require('nodemailer');
require ('dotenv').config();
const email = process.env.MAIL_USERNAME;
const password = process.env.MAIL_PASSWORD;

const emailController = {};
// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  }
});

emailController.sendEmail = (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'SGI_Notifications <'+email+'>',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: 'Error al enviar el correo' }); // Enviar respuesta JSON en caso de error
    } else {
      res.status(200).json({ message: 'Correo enviado correctamente' }); // Enviar respuesta JSON en caso de éxito
    }
  });
};

module.exports = emailController;
