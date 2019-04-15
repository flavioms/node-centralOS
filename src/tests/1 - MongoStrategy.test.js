const assert = require('assert')
const MongoDb = require('../db/strategies/mongodb/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

describe('MongoDb Strategy', function() {
  this.timeout(Infinity)
  this.beforeAll(async function() {
    const connection = MongoDb.connect()
    context = new Context(new MongoDb(connection))
  })
  
  it('Verificar conexão', async () => {
    const result = await context.isConnected()
    const expected = 'Conectado'
    assert.deepEqual(result, expected)
  })
})