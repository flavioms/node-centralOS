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
    type: String,
    required: true
  },
  modulo: {
    type: String
  },
  totvs: {
    type: String
  },
  setor:{
    type: String,
    required: true
  },
  usuario: {
    nome: {
      type: String
    },
    email: {
      type: String
    },
    setor: {
      type: String
    },
    ccusto: {
      type: String
    }
  },
  suporte: {
    type: String
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
      nome: {
        type: String
      },
      email: {
        type: String
      },
      setor: {
        type: String
      },
      ccusto: {
        type: String
      }
    },
    texto: {
      type: String,
      required: true
    },
    data: {
      type: Date
    }
  }],
  dtAbertura: {
    type: Date
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