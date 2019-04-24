const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongodb')

const UsuarioRoutes = require('./src/routes/UsuarioRoutes')
const UsuarioSchema = require('./src/db/strategies/mongodb/schemas/usuarioSchema')
const TicketRoutes = require('./src/routes/TicketRoutes')
const TicketSchema = require('./src/db/strategies/mongodb/schemas/ticketSchema')
const CategoriaRoutes = require('./src/routes/CategoriaRoutes')
const CategoriaSchema = require('./src/db/strategies/mongodb/schemas/categoriaSchema')
const ModuloRoutes = require('./src/routes/ModuloRoutes')
const ModuloSchema = require('./src/db/strategies/mongodb/schemas/moduloSchema')
const AuthRoutes = require('./src/routes/AuthRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const Jwt = require('jsonwebtoken')
const HapiJwt = require('hapi-auth-jwt2')

const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "A env é inválida!!")
const configPath = join(__dirname, './config', `.env.${env}`)
config({path: configPath})

const swaggerConfig = {
  info: {
    title: 'API Central de Os',
    version: 'v1.0'
  },
  lang: 'pt'
}

const app = new Hapi.Server({
  port: process.env.PORT || 5000,
  routes: {
    cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"],
        additionalHeaders: ["X-Requested-With"]
    }
  }
})

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]())
}

async function main(){
  const connection = MongoDB.connect()
  const mongoDbUsuario = new Context(new MongoDB(connection, UsuarioSchema))
  const mongoDbTicket = new Context(new MongoDB(connection, TicketSchema))
  const mongoDbCategoria = new Context(new MongoDB(connection, CategoriaSchema))
  const mongoDbModulo = new Context(new MongoDB(connection, ModuloSchema))
  
  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerConfig
    }
  ])

   app.auth.strategy('jwt', 'jwt', {
      key: process.env.JWT_KEY,
      validate: (dado, request) => {
        return {
          isValid: true
        }
      },
      verifyOptions: {
        ignoreExpiration: true,
        algorithms: [ process.env.JWT_ALGORITHMS ]
      }
   })


  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new UsuarioRoutes(mongoDbUsuario), UsuarioRoutes.methods()),
    ...mapRoutes(new TicketRoutes(mongoDbTicket), TicketRoutes.methods()),
    ...mapRoutes(new CategoriaRoutes(mongoDbCategoria), CategoriaRoutes.methods()),
    ...mapRoutes(new ModuloRoutes(mongoDbModulo), ModuloRoutes.methods()),
    ...mapRoutes(new AuthRoutes(process.env.JWT_KEY, mongoDbUsuario), AuthRoutes.methods())
  ])
  
  await app.start()
  console.log('Servidor rodando porta', process.env.PORT)
  return app
}

module.exports = main()