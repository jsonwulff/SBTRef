const TCGReg = artifacts.require('TCGReg');
const TCGTok = artifacts.require('TCGTok');
const utils = require('./utils');
contract('TCGReg', (accounts) => {
    let [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, acc10] = accounts;
    beforeEach(async () => {
        //Setup two contracts and two registered accounts
        reg = await TCGReg.new();
        await reg.register("Account 1", {from: acc1});
        await reg.register("Account 2", {from: acc2});
        tok = await TCGTok.new(reg.address);
    });

    it('should get false if getting a non-existing player', async () => {
        assert.equal(await reg.getIsRegistered(acc3), false);
    });
    it('should get true if getting an existing player', async () => {
        assert.equal(await reg.getIsRegistered(acc1), true);
    });
    it('should be able to register', async () => {
        await reg.register('acc3', {from: acc3});
        assert.equal(await reg.getIsRegistered(acc3), true);
    });
    it('should not be able to register twice', async () => {
        await reg.register("ASDF", {from: acc3});
        utils.shouldThrow(reg.register("FDSA", {from: acc3}));
    });
    it('should not be able to get player info on a non-existing player', async () => {
        utils.shouldThrow(reg.getPlayerInfo(acc10));
    });
    it('should increment trade count on players after trade', async () => {
        await reg.incrementTrades(acc1, acc2, {from: acc1});
        assert.equal(await reg.getPlayerTrades(acc1), 1);
        assert.equal(await reg.getPlayerTrades(acc2), 1);
    });
});
