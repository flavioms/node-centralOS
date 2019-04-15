const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = '123456';
const HASH = '$2b$04$22wvSf4Ep0VC/2BOMK1oAOy8ChrDmh4Ah0mJn/ktaUa7NTMiWVjgm';



describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        assert.ok(result.length > 10);
    });
    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })

});