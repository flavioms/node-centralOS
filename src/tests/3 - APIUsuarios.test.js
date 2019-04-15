const assert = require('assert')
const api = require('../../api')
let app = {}
let MOCK_ID = ''
let MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdldGluMC4wMDY0NDY5MDYyODY4MTM5OTE1QG9ybWVjLmNvbS5iciIsImlhdCI6MTU1MDQyNzU5M30.tWTCK-Rdn4FU-1Rl_MqL8rPUyRNaAckh2NDvbz4Bpvc'
let headers = {
  Authorization: MOCK_TOKEN
}
let MOCK_USUARIO = {
  nome: 'Flavio',
  ccusto: '01000IN',
  setor: 'TI',
  filial: 'MVR',
  email: `flavio${Math.random(1)}@ormec.com.br`,
  senha: '123456',
  admin: true
}

let MOCK_USUARIO_ALEATORIO = {
  nome: 'Engenharia',
  ccusto: '23001',
  filial: 'MVR',
  setor: 'TI',
  email: `engenharia${Math.random(1)}@ormec.com.br`,
  senha: '123456',
  admin: true
}

function cadastrarUsuario(usuario){
  return app.inject({
    method: 'POST',
    url: '/users',
    headers,
    payload: usuario
  })
}

describe('ApiChamado Test', function(){
  this.beforeAll(async () => {
    app = await api
    const result = await cadastrarUsuario(MOCK_USUARIO_ALEATORIO)
    MOCK_ID = JSON.parse(result.payload)._id
  })
  
  it('POST em /users - Cadastra usuário', async () => {
    const result = await cadastrarUsuario(MOCK_USUARIO)
    const payload = JSON.parse(result.payload)
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(payload.nome, 'Flavio')
  })

  it('POST em /users - Cadastra usuario com email duplicado', async () => {
    const result = await cadastrarUsuario(MOCK_USUARIO)
    const payload = JSON.parse(result.payload)
    assert.deepEqual(result.statusCode, 500)
  })
  
  it('POST em /users - Campo obrigatório em branco', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/users',
      headers,
      payload: {
        nome: 'Flavio',
        ccusto: '01000IN',
        filial: 'MVR',
        admin: true,
      }
    })
    const payload = JSON.parse(result.payload)
    assert.deepEqual(result.statusCode, 400)
  })
  
  it('GET em /users - Todos os usuários', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/users',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(payload))
  })
  
  it('GET em /users/{id} - Usuario especifico', async () => {
    const result = await app.inject({
      method: 'GET',
      url: `/users/${MOCK_ID}`,
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.deepEqual(payload.length, 1)
  })
  
  it('PATCH em /users/{id} - Atualizar Usuario', async () => {
    const MOCK_ATUALIZA = {
      nome: 'getin',
      email: `getin${Math.random(1)}@ormec.com.br`,
      senha: 'flavio148'
    }
    const result = await app.inject({
      method: 'PATCH',
      url: `/users/${MOCK_ID}`,
      headers,
      payload: MOCK_ATUALIZA
    })
    assert.deepEqual(result.statusCode, 200) 
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
  
  it('DELETE em /users/{id} - Remover Usuario', async() => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/users/${MOCK_ID}`,
      headers
    })
    
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
})
