const assert = require('assert')
const api = require('../../api')
let app = {}
let MOCK_USUARIO = ''
let MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdldGluMC4wMDY0NDY5MDYyODY4MTM5OTE1QG9ybWVjLmNvbS5iciIsImlhdCI6MTU1MDQyNzU5M30.tWTCK-Rdn4FU-1Rl_MqL8rPUyRNaAckh2NDvbz4Bpvc'
let headers = {
  Authorization: MOCK_TOKEN
}

describe('ApiChamado Test', function(){
  this.beforeAll(async () => {
    app = await api;
     const result = await app.inject({
       method: 'GET',
       url: '/users',
       headers
     });
     [MOCK_USUARIO] = JSON.parse(result.payload)
  })
  
  it('POST em /login - Login do sistema', async () => {
    const result = await app.inject({
      url: '/login',
      method: 'POST',
      payload: {
        email: MOCK_USUARIO.email,
        senha: 'e54aac'
      }
    })
    assert.deepEqual(result.statusCode, 200)
    assert.ok(JSON.parse(result.payload).token.length > 10)
  })

  it('POST em /reset - Resetar Senha', async () => {
    const result = await app.inject({
      url: '/reset',
      method: 'POST',
      payload: {
        email: MOCK_USUARIO.email
      }
    })
    const payload = JSON.parse(result.payload)
    assert.ok(payload.accepted.length > 0)
    assert.deepEqual(payload.response.substring(0,3), 250)
  })

  it('POST em /reset - Resetar Senha de e-mail incorreto', async () => {
    const result = await app.inject({
      url: '/reset',
      method: 'POST',
      payload: {
        email: `ERRADO${MOCK_USUARIO.email}`
      }
    })
    const payload = JSON.parse(result.payload)
    assert.deepEqual(payload.statusCode, 401)
  })
})
