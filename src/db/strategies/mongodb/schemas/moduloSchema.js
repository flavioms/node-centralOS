const Mongoose = require('mongoose')
const moduloSchema = new Mongoose.Schema({
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