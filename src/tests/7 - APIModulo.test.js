const assert = require('assert')
const api = require('../../api')
let MOCK_ID = ''
let MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdldGluMC4wMDY0NDY5MDYyODY4MTM5OTE1QG9ybWVjLmNvbS5iciIsImlhdCI6MTU1MDQyNzU5M30.tWTCK-Rdn4FU-1Rl_MqL8rPUyRNaAckh2NDvbz4Bpvc'
let app = {}
let headers = {
  Authorization: MOCK_TOKEN
}
function cadastrarModulo(){
  return app.inject({
    method: 'POST',
    url: '/modulos',
    headers,
    payload: {
      nome: 'SIGACOM'
    }
  })
}

describe('APIModulo Test', function(){
  this.beforeAll(async () => {
    app = await api
    const result = await cadastrarModulo()
    MOCK_ID = JSON.parse(result.payload)._id
  })
  
  it('POST em /modulos - Cadastro de Modulo', async () => {
    const result = await cadastrarModulo()
    
    const payload = JSON.parse(result.payload)
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(payload.nome, 'SIGACOM')
  })

  
  it('GET em /modulos - Listar todos os modulos', async () => {
    const result = await app.inject({
      url: '/modulos',
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(payload))
  })
  
  it('GET em /modulos/{id} - Listar modulo de id especifico', async() => {
    const result = await app.inject({
      url: `/modulos/${MOCK_ID}`,
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.deepEqual(payload.length, 1)
  })
  
  it('PATCH em /modulos/{id} - Atualizar modulo', async () => {
    const MOCK_ATUALIZA = {
      nome: 'SIGAGPE'
    }
    const result = await app.inject({
      url: `/modulos/${MOCK_ID}`,
      method: 'PATCH',
      headers,
      payload: MOCK_ATUALIZA
    })
    
    assert.deepEqual(result.statusCode, 200) 
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
  
  it('DELETE em /modulo/{id} - Remover modulo', async () => {
    const result = await app.inject({
      url: `/modulos/${MOCK_ID}`,
      method: 'DELETE',
      headers
    })
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
})