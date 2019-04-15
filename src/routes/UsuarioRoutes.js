const baseRoute = require('./base/baseRoute')
const PasswordHelper = require('./../helpers/passwordHelper')
const Joi = require('joi')

class UsuarioRoutes extends baseRoute {
	constructor(db){
		super()
		this.db = db
	}
	
	create() {
		return {
			path: '/users',
			method: 'POST',
			config: {
				tags: ['api'],
				description: 'Cadastrar usuarios',
				notes: 'Cadastra usuarios para autenticação no sistema',
				validate: {
					failAction: (request, h, err) => {
						throw err;
					},
					headers: Joi.object({
							authorization: Joi.string().optional().allow('')
					}).unknown(),
					payload: {
						nome: Joi.string().max(100).required(),
						ccusto: Joi.string().max(100).required(),
						setor: Joi.string().max(100).required(),
						filial: Joi.string().max(3).required(),
						email: Joi.string().email({ minDomainAtoms: 2 }),
						senha: Joi.string(),
						admin: Joi.boolean().required()
					}
				},
			},
			handler: async (request, headers) => {
				const payload = request.payload
				const senhaCripty = await PasswordHelper.hashPassword(payload.senha)
				
				const user = {
					...payload,
					senha: senhaCripty
				}
				return this.db.create(user)
			}
		}
	}
	
	list() {
		return {
			path: '/users/{_id?}',
			method: 'GET',
			config: {
				tags: ['api'],
				description: 'Listar todos os usuários',
				notes: 'Lista todos os usuários cadastrados no banco',
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
			path: '/users/{id}',
			method: 'PATCH',
			config: {
				tags: ['api'],
				description: 'Atualizar usuario',
				notes: 'Atualizar os dados de um usuário especifico',
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
						ccusto: Joi.string().max(100),
						setor: Joi.string().max(100),
						filial: Joi.string().max(3),
						email: Joi.string().email({ minDomainAtoms: 2 }),
						senha: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
						admin: Joi.boolean()
					}
				}
			},
			handler: async (request, headers) => {
				const payload = request.payload;
				const id = request.params.id;
				if(payload.senha){
					payload.senha = await PasswordHelper.hashPassword(payload.senha)
				}
				return this.db.update(id, payload)
			}
		}
	}
	
	delete() {
		return {
			path: '/users/{id}',
			method: 'DELETE',
			config: {
				tags: ['api'],
				description: 'Remover usuario',
				notes: 'Remover o usuario com um ID especifico',
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

module.exports = UsuarioRoutes