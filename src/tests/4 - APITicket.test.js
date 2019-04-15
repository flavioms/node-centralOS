const assert = require('assert')
const api = require('../../api')
let app = {}
let MOCK_ID = '5c6497d1d0b14c2304587edf'
let USUARIO_ID = '5c5df41b39d64c19080f177c'
let SUPORTE_ID = '5c60223311a3b92f70ca0041'
let CATEGORIA_ID = '5cb0f12cf2e1a426988758c2'
let MODULO_ID = '5cb1c799f81e9c2430d1bc96'
let INTERACAO = {
  usuario: USUARIO_ID,
  texto: 'Incluindo interação com a nova rota',
  data: Date.now()
}
let MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdldGluMC4wMDY0NDY5MDYyODY4MTM5OTE1QG9ybWVjLmNvbS5iciIsImlhdCI6MTU1MDQyNzU5M30.tWTCK-Rdn4FU-1Rl_MqL8rPUyRNaAckh2NDvbz4Bpvc'
let headers = {
  Authorization: MOCK_TOKEN
}

function cadastrarTicket(){
  return app.inject({
    method: 'POST',
    url: '/ticket',
    headers,
    payload: {
      titulo: 'Alterar o ULMES da filial 20',
      categoria: CATEGORIA_ID,
      modulo: MODULO_ID,
      usuario: USUARIO_ID,
      suporte: SUPORTE_ID,
      status: 'Em Atendimento',
      totvs: '',
      ccusto: '01000IN',
      setor: 'TI',
      dtAbertura: Date.now(),
      dtEncerramento: Date.now(),
      interacoes: [
        {
          texto: 'Solicito a alteração do parametro ULMES da filial 20 para a data 31/01/2019',
          usuario: USUARIO_ID
        }
      ],
    }
  })
}

describe('APITicket Test', function(){
  this.beforeAll(async () => {
    app = await api
    const result = await cadastrarTicket()
    MOCK_ID = JSON.parse(result.payload)._id
  })
  
  it('POST em /ticket - Cadastro de Ticket', async () => {
    const result = await cadastrarTicket()
    const payload = JSON.parse(result.payload)
    console.log(payload)
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(payload.categoria, CATEGORIA_ID)
  })
  
  it('POST em /ticket/{id} - Cadastro de Interações', async () => {
    const result = await app.inject({
      url: `/ticket/${MOCK_ID}`,
      method: 'POST',
      headers,
      payload: {
        interacoes: [INTERACAO]
      }
    })
    const payload = JSON.parse(result.payload)
    assert.ok(payload.interacoes.length > 0)
  })
  
  it('GET em /ticket - Listar todos os tickets', async () => {
    const result = await app.inject({
      url: '/ticket',
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(payload))
  })
  
  it('GET em /ticket/{id} - Listar ticket de id especifico', async() => {
    const result = await app.inject({
      url: `/ticket/${MOCK_ID}`,
      method: 'GET',
      headers
    })
    
    const payload = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.deepEqual(payload.length, 1)
  })
  
  it('PATCH em /ticket/{id} - Atualizar ticket', async () => {
    const MOCK_ATUALIZA = {
      titulo: 'Instalar o validador da DIRF 2019',
      categoria: CATEGORIA_ID,
      modulo: MODULO_ID
    }
    const result = await app.inject({
      url: `/ticket/${MOCK_ID}`,
      method: 'PATCH',
      headers,
      payload: MOCK_ATUALIZA
    })
    
    assert.deepEqual(result.statusCode, 200) 
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
  
  it('DELETE em /ticket/{id} - Remover ticket', async () => {
    const result = await app.inject({
      url: `/ticket/${MOCK_ID}`,
      method: 'DELETE',
      headers
    })
    
    assert.deepEqual(result.statusCode, 200)
    assert.deepEqual(JSON.parse(result.payload).nModified, 1)
  })
})