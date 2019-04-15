const assert = require('assert')
const api = require('../../api')
let MOCK_ID = ''
let MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdldGluMC4wMDY0NDY5MDYyODY4MTM5OTE1QG9ybWVjLmNvbS5iciIsImlhdCI6MTU1MDQyNzU5M30.tWTCK-Rdn4FU-1Rl_MqL8rPUyRNaAckh2NDvbz4Bpvc'
let app = {}
let headers = {
  Authorization: MOCK_TOKEN
}
function cadastrarCategoria(){
  return app.inject({
    method: 'POST',
    url: '/categorias',
    headers,
    payload: {
      nome: 'Software',
      sla: '2',
    }
  })
}

describe('APICategoria Test', function(){
  this.beforeAll(async () => {
    app = await api
    const result = await cadastrarCategoria()
    MOCK_ID = JSON.parse(result.payload)._id
  })
  
  it('POST em /categorias - Cadastro de Categoria', async () => {
    const result = await cadastrarCategoria()
    
    const payload = JSON.parse(result.payload)
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(payload.nome, 'Software')
  })

  
  it('GET em /categorias - Listar todos os categorias', async () => {
    const result = await app.inject({
      url: '/categorias',
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(payload))
  })
  
  it('GET em /categorias/{id} - Listar categoria de id especifico', async() => {
    const result = await app.inject({
      url: `/categorias/${MOCK_ID}`,
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.deepEqual(payload.length, 1)
  })
  
  it('PATCH em /categorias/{id} - Atualizar categoria', async () => {
    const MOCK_ATUALIZA = {
      sla: '3'
    }
    const result = await app.inject({
      url: `/categorias/${MOCK_ID}`,
      method: 'PATCH',
      headers,
      payload: MOCK_ATUALIZA
    })
    
    assert.deepEqual(result.statusCode, 200) 
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
  
  it('DELETE em /categoria/{id} - Remover categoria', async () => {
    const result = await app.inject({
      url: `/categorias/${MOCK_ID}`,
      method: 'DELETE',
      headers
    })
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
})