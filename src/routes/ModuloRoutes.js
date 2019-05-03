const baseRoute = require('./base/baseRoute')
const Joi = require('joi')

class ModuloRoutes extends baseRoute {
	constructor(db){
		super()
		this.db = db
	}
	
	create() {
		return {
			path: '/modulos',
			method: 'POST',
			config: {
				tags: ['api'],
				description: 'Cadastrar modulo',
				notes: 'Cadastra modulo para cadastro de OS',
				validate: {
					failAction: (request, h, err) => {
						throw err;
					},
					headers: Joi.object({
							authorization: Joi.string().optional().allow('')
					}).unknown(),
					payload: {
						sigla: Joi.string().max(100).required(),
						nome: Joi.string().max(100).required()
					}
				},
			},
			handler: async (request, headers) => {
				const payload = request.payload
				return this.db.create(payload)
			}
		}
	}
	
	list() {
		return {
			path: '/modulos/{_id?}',
			method: 'GET',
			config: {
				tags: ['api'],
				description: 'Listar todas as modulos',
				notes: 'Lista todas as modulos cadastrados no banco',
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
	
	update() {
		return {
			path: '/modulos/{id}',
			method: 'PATCH',
			config: {
				tags: ['api'],
				description: 'Atualizar modulo',
				notes: 'Atualizar os dados de uma modulo especifica',
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
						sigla: Joi.string().max(100),
						nome: Joi.string().max(100)
					}
				}
			},
			handler: async (request, headers) => {
				const payload = request.payload;
				const id = request.params.id;
				return this.db.update(id, payload)
			}
		}
	}
	
	delete() {
		return {
			path: '/modulos/{id}',
			method: 'DELETE',
			config: {
				tags: ['api'],
				description: 'Remover modulo',
				notes: 'Remover a modulo com um ID especifico',
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
	
}

module.exports = ModuloRoutes