const Mongoose = require('mongoose')
const usuarioSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  ccusto: {
    type: String,
    required: true
  },
  setor:{
    type: String,
    required: true
  },
  filial: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: { unique: true },
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = Mongoose.model('usuarios', usuarioSchema)