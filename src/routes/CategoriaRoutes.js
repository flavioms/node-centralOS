const baseRoute = require('./base/baseRoute')
const Joi = require('joi')

class CategoriaRoutes extends baseRoute {
	constructor(db){
		super()
		this.db = db
	}
	
	create() {
		return {
			path: '/categorias',
			method: 'POST',
			config: {
				tags: ['api'],
				description: 'Cadastrar categoria',
				notes: 'Cadastra categoria para cadastro de OS',
				validate: {
					failAction: (request, h, err) => {
						throw err;
					},
					headers: Joi.object({
							authorization: Joi.string().optional().allow('')
					}).unknown(),
					payload: {
						nome: Joi.string().max(100).required(),
						sla: Joi.string().max(100).required()
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
			path: '/categorias/{_id?}',
			method: 'GET',
			config: {
				tags: ['api'],
				description: 'Listar todas as categorias',
				notes: 'Lista todas as categorias cadastrados no banco',
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
			path: '/categorias/{id}',
			method: 'PATCH',
			config: {
				tags: ['api'],
				description: 'Atualizar categoria',
				notes: 'Atualizar os dados de uma categoria especifica',
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
						nome: Joi.string().max(100),
						sla: Joi.string().max(100)
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
			path: '/categorias/{id}',
			method: 'DELETE',
			config: {
				tags: ['api'],
				description: 'Remover categoria',
				notes: 'Remover a categoria com um ID especifico',
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

module.exports = CategoriaRoutes