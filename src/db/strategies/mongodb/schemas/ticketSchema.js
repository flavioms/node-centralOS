const Mongoose = require('mongoose')
const ObjectId = Mongoose.Schema.Types.ObjectId;

const ticketSchema = new Mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  categoria: {
    type: ObjectId,
    required: true
  },
  modulo: {
    type: ObjectId
  },
  totvs: {
    type: String
  },
  ccusto: {
    type: String,
    required: true
  },
  setor:{
    type: String,
    required: true
  },
  usuario: {
    type: ObjectId
  },
  suporte: {
    type: ObjectId
  },
  timelapse: [{
    status: {
      type: String
    },
    horario: {
      type: Date
    }
  }],
  interacoes: [{
    usuario: {
      type: ObjectId
    },
    texto: {
      type: String,
      required: true
    },
    data: {
      type: Date,
      default: new Date().toLocaleString('pt-br')
    }
  }],
  dtAbertura: {
    type: Date,
    default: new Date().toLocaleString('pt-br')
  },
  dtEncerramento: {
    type: Date,
  },
  deleted: {
    type: Boolean,
    default: false
  }
})
module.exports = Mongoose.model('tickets', ticketSchema)