const TCGTok = artifacts.require("TCGTok");
const utils = require("./utils");
contract('TCGTok', (accounts) => {
    let [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, acc10] = accounts;
    beforeEach(async () => {
        contractInstance = await TCGTok.new();
    });
    it('should have acc1 as owner', async () => {
        let owner = await contractInstance.owner();
        assert.equal(owner, acc1);
    });
    it('should be able to mint', async () => {
        await contractInstance.safeMint(acc1, "0", {from: acc1});
        let owner = await contractInstance.ownerOf(0);
        assert.equal(owner, acc1);
    });
    it('should be able to mint for others', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        let owner = await contractInstance.ownerOf(0);
        assert.equal(owner, acc2);
    });
    it('should be able to offer trade', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        let trade = await contractInstance.getTrade(0);
        assert.equal(trade.id, 0);
        assert.equal(trade.closed, false);
    });
    it('should be able to accept trade', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        
        await contractInstance.acceptTrade(0, {from: acc2});
        let trade = await contractInstance.getTrade(0);
        assert.equal(trade.closed, true);
        let owner = await contractInstance.ownerOf(0);
        assert.equal(owner, acc1);
    });
    it('should be not be able to accept trade twice', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        
        await contractInstance.acceptTrade(0, {from: acc2});
        await utils.shouldThrow(contractInstance.acceptTrade(0, {from: acc2}));
    });
    it('should be able to decline trade', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        
        await contractInstance.declineTrade(0, {from: acc2});
        let trade = await contractInstance.getTrade(0);
        assert.equal(trade.closed, true);
        let owner = await contractInstance.ownerOf(0);
        assert.equal(owner, acc2);
    });
    it('should be able to close trade', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        
        await contractInstance.closeTrade(0, {from: acc1});
        let trade = await contractInstance.getTrade(0);
        assert.equal(trade.closed, true);
        let owner = await contractInstance.ownerOf(0);
        assert.equal(owner, acc2);
    });
    it('should be able to trade many cards', async () => {
        await contractInstance.safeMint(acc1, "0", {from: acc1});
        await contractInstance.safeMint(acc1, "1", {from: acc1});
        await contractInstance.safeMint(acc1, "2", {from: acc1});

        await contractInstance.safeMint(acc2, "3", {from: acc1});
        await contractInstance.safeMint(acc2, "4", {from: acc1});

        assert.equal(await contractInstance.ownerOf(0), acc1);
        assert.equal(await contractInstance.ownerOf(1), acc1);
        assert.equal(await contractInstance.ownerOf(2), acc1);
        assert.equal(await contractInstance.ownerOf(3), acc2);
        assert.equal(await contractInstance.ownerOf(4), acc2);

        await contractInstance.makeTradeOffer(acc1, acc2, [0, 1, 2], [3, 4], {from: acc1});
        await contractInstance.acceptTrade(0, {from: acc2});

        assert.equal(await contractInstance.ownerOf(0), acc2);
        assert.equal(await contractInstance.ownerOf(1), acc2);
        assert.equal(await contractInstance.ownerOf(2), acc2);
        assert.equal(await contractInstance.ownerOf(3), acc1);
        assert.equal(await contractInstance.ownerOf(4), acc1);

        let trade = await contractInstance.getTrade(0);
        assert.equal(trade.closed, true);
    });
    it('should not be able to offer a card you don\'t own', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        utils.shouldThrow(contractInstance.makeTradeOffer(acc1, acc2, [0], [], {from: acc1}));
    });
    it('should not be able to accept a trade not meant for you', async () => {
        await contractInstance.safeMint(acc2, "0", {from: acc1});
        await contractInstance.makeTradeOffer(acc1, acc2, [], [0], {from: acc1});
        utils.shouldThrow(contractInstance.acceptTrade(0, {from: acc1}));
    });
});
