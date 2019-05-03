const Mongoose = require('mongoose')
const moduloSchema = new Mongoose.Schema({
  sigla: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = Mongoose.model('modulos', moduloSchema)