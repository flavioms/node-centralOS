const nodemailer = require("nodemailer")

class enviarEmail {
  static async criaServidor() {
    const transporter = await nodemailer.createTransport({
      host: process.env.SERVER_EMAIL,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL
      }
    })

    return transporter
  }
}

module.exports = enviarEmail