const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const PasswordHelper = require('./../helpers/passwordHelper')
const EnviarEmail = require('./../helpers/enviarEmail')
const Jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {
	constructor(key, db) {
		super()
		this.secret = key
		this.db = db
	}

	login() {
		return {
			path: '/login',
			method: 'POST',
			config: {
				auth: false,
				tags: ['api'],
				description: 'fazer login',
				notes: 'retorna o token',
				validate: {
					payload: {
						email: Joi.string().email({
							minDomainAtoms: 2
						}),
						senha: Joi.string().required()
					}
				}
			},
			handler: async (request, headers) => {
				const {
					email,
					senha
				} = request.payload


				const [user] = await this.db.read({
					email: email.toLowerCase(),
				})

				if (!user) {
					return Boom.unauthorized('O usuario informado nao existe')
				}

				const match = await PasswordHelper.comparePassword(senha, user.senha)

				if (!match) {
					return Boom.unauthorized('O usuario e senha invalidos!')
				}

				return {
					token: Jwt.sign({
						email: email,
						nome: user.nome,
						ccusto: user.ccusto,
						setor: user.setor,
						filial: user.filial,
						suporte: user.suporte
					}, this.secret)
				}
			}
		}
	}

	resetar() {
		return {
			path: '/reset',
			method: 'POST',
			config: {
				auth: false,
				tags: ['api'],
				description: 'Resetar o password',
				notes: 'Reseta o password e envia por email',
				validate: {
					payload: {
						email: Joi.string().email({
							minDomainAtoms: 2
						})
					}
				}
			},
			handler: async (request, headers) => {
				const {email} = request.payload
				const [user] = await this.db.read({
					email: email.toLowerCase(),
				})
				if (!user) {
					return Boom.unauthorized('O usuario informado nao existe')
				}
				try {
					const senha = Math.floor(Math.random()*16777215).toString(16)
					const senhaCripty = await PasswordHelper.hashPassword(senha)
					const resultUpdate = await this.db.update(user.id, {senha: senhaCripty})
			
					if(resultUpdate.nModified == 1){
						const mailOptions = {
							from: process.env.USER_EMAIL,
							to: email,
							subject: "Reset senha node",
							text: "Resetar senha no node",
							html: `<p>Nova senha para acesso a central de chamado <b>${senha}</b></p>`
						}
						const transporter = await EnviarEmail.criaServidor()
						const info = await transporter.sendMail(mailOptions)
						return info
					} else {
						return Boom.badRequest('Não foi possivel resetar a senha', resultUpdate)
					}
				} catch (error) {
					return Boom.badRequest('Não foi possivel enviar o e-mail com a nova senha', error)
				}
			}
		}
	}
}
module.exports = AuthRoutes