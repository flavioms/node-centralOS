const baseRoute = require('./base/baseRoute')
const Joi = require('joi')
const moment = require('moment-timezone')
const DATA_ATUAL = moment().tz("America/Sao_Paulo").format()

class TicketRoutes extends baseRoute {
  constructor(db){
    super()
    this.db = db
  }
  
  create(){
    return {
      path: '/ticket',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Cadastrar tickets',
        notes: 'Cadastrar tickets no sistema',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          headers: Joi.object({
              authorization: Joi.string().required()
          }).unknown(),
          payload: {
            status: Joi.string().required(),
            titulo: Joi.string().required().max(100).min(3),
            categoria: Joi.string().required(),
            modulo: Joi.string().allow('').optional(),
            totvs: Joi.string().allow('').optional(),
            ccusto: Joi.string().required(),
            setor: Joi.string().required(),
            usuario: Joi.string().required(),
            suporte: Joi.string().allow('').optional(),
            dtAbertura: Joi.date().required(),
            dtEncerramento: Joi.date().required(),
            timelapse: Joi.array().optional(),
            interacoes: Joi.array().optional()
          }
        }
      },
      handler: (request, headers) => {
        const payload = request.payload
        return this.db.create(payload)
      }
    }  
  }
  
  interact(){
    return {
      path: '/ticket/{id}',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Cadastrar interações',
        notes: 'Cadastrar interações nos tickets do sistema',
        validate: {
          headers: Joi.object({
              authorization: Joi.string().required()
          }).unknown(),
          failAction: (request, h, err) => {
            throw err;
          },
          params: {
            id: Joi.string().required()                
          },
          payload: {
            interacoes: Joi.array().optional()
          }
        }
      },
      handler: (request, headers) => {
        const payload = request.payload
        const id = request.params.id;
        return this.db.updatePush(id, payload)
      }
    }  
  }
  
  update(){
    return{
      path: '/ticket/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Atualizar ticket',
        notes: 'Atualizar os dados do ticket',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          headers: Joi.object({
              authorization: Joi.string().required()
          }).unknown(),
          params: {
            id: Joi.string().required()                
          },
          payload: {
            status: Joi.string().required(),
            titulo: Joi.string().required().max(100).min(3),
            categoria: Joi.string().required(),
            modulo: Joi.string().allow('').optional(),
            totvs: Joi.string().allow('').optional(),
            ccusto: Joi.string().required(),
            setor: Joi.string().required(),
            usuario: Joi.string().required(),
            suporte: Joi.string().allow('').optional(),
            dtAbertura: Joi.date().required(),
            dtEncerramento: Joi.date().required(),
            timelapse: Joi.array().optional(),
            interacoes: Joi.array().optional()
          }
        }
      },
      handler: (request, headers) => {
        const payload = request.payload;
        const id = request.params.id;
        return this.db.update(id, payload)
      }
    }
  }
  
  delete(){
    return{
      path: '/ticket/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Remover ticket',
        notes: 'Remover ticket com um ID especifico',
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          headers: Joi.object({
              authorization: Joi.string().required()
          }).unknown(),
          params: {
            id: Joi.string().required()                
          },
        }
      },
      handler: (request, headers) => {
        return this.db.update(request.params.id, {deleted: true})
      }
    }
  }
  
  list() {
    return {
      path: '/ticket/{_id?}',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Listar todos os tickets',
        notes: 'Lista todos os tickets cadastrados no banco',
        validate: {
					headers: Joi.object({
							authorization: Joi.string().required()
					}).unknown()
				},
      },
      handler: (request, headers) => {
        const params = request.params || {}
        const itens = {
          ...params,
          deleted: false
        }
        return this.db.read(itens)
      }
    }
  }
}

module.exports = TicketRoutes