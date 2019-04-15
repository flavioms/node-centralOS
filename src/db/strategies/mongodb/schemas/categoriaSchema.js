const Mongoose = require('mongoose')
const categoriaSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sla: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = Mongoose.model('categorias', categoriaSchema)