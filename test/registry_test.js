const TCGReg = artifacts.require('TCGReg');
const utils = require('./utils');
contract('TCGReg', (accounts) => {
    let [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, acc10] = accounts;
    beforeEach(async () => {
        contractInstance = await TCGReg.new();
    });

    it('should get false if getting a non-existing player', async () => {
        assert.equal(await contractInstance.getIsRegistered(acc1), false);
    });
    it('should be able to register', async () => {
        await contractInstance.register();
        assert.equal(await contractInstance.getIsRegistered(acc1), true);
    });
    it('should not be able to register twice', async () => {
        await contractInstance.register();
        utils.shouldThrow(contractInstance.register());
    });
    it('should not be able to get player info on a non-existing player', async () => {
        utils.shouldThrow(contractInstance.getPlayerInfo(acc1));
    });
});
