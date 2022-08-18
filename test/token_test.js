const TCGTok = artifacts.require('TCGTok');
const TCGReg = artifacts.require('TCGReg');
const utils = require('./utils');
contract('TCGTok', (accounts) => {
    let [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, acc10] = accounts;
    beforeEach(async () => {
        let reg = await TCGReg.new();
        await reg.register('acc1', {from: acc1});
        await reg.register('acc2', {from: acc2});
        contractInstance = await TCGTok.new(reg.address);
    });
    afterEach(async () => {
        await contractInstance.withdrawEth({from: acc1});
    });

    it('should have acc1 as owner', async () => {
        let owner = await contractInstance.owner();
        assert.equal(owner, acc1);
    });
    it('should be able to get player cards (0)', async () => {

        let res = await contractInstance.getCardsByOwner(acc1);
        assert.equal(res.length, 0);
    });
    it('should be able to get player cards (10)', async () => {
        for (let i = 0; i < 10; i++) {
            await contractInstance.safeMint(acc1, '', 0, {from: acc1});
        }
        let res = await contractInstance.getCardsByOwner(acc1);
        assert.equal(res.length, 10);
    });
    context('Minting', async () => {
        it('should be able to mint for self', async () => {
            await contractInstance.safeMint(acc1, '', 0, {from: acc1});
            assert.equal(await contractInstance.ownerOf(0), acc1);
            utils.shouldThrow(contractInstance.ownerOf(1));
        });
        it('should be able to mint for others', async () => {
            await contractInstance.safeMint(acc2, '', 0, {from: acc1});
            assert.equal(await contractInstance.ownerOf(0), acc2);
            utils.shouldThrow(contractInstance.ownerOf(1));
        });
    });

    // #####################################################################
    // ######################### TESTING TRADES  ###########################
    // #####################################################################
    context('Trading', async () => {
        it('should only be able to offer trade if registered', async () => {
            utils.shouldThrow(contractInstance.makeTradeOffer(acc1, [], [], {from: acc3}));
        });
        it('should only be able to offer trade if recipient is registered', async () => {
            utils.shouldThrow(contractInstance.makeTradeOffer(acc3, [], [], {from: acc1}));
        });
        it('should be able to offer trade', async () => {
            await contractInstance.safeMint(acc2, '0', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            let trade = await contractInstance.getTrade(1);
            assert.equal(trade.closed, false);
        });
        it('should be able to accept trade', async () => {
            await contractInstance.safeMint(acc2, '0', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            
            await contractInstance.acceptTrade(1, {from: acc2});
            let trade = await contractInstance.getTrade(1);
            assert.equal(trade.closed, true);
            let owner = await contractInstance.ownerOf(0);
            assert.equal(owner, acc1);
        });
        it('should be not be able to accept trade twice', async () => {
            await contractInstance.safeMint(acc2, '0', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            
            await contractInstance.acceptTrade(1, {from: acc2});
            await utils.shouldThrow(contractInstance.acceptTrade(1, {from: acc2}));
        });
        it('should be able to decline trade', async () => {
            await contractInstance.safeMint(acc2, '0', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            
            await contractInstance.declineTrade(1, {from: acc2});
            let trade = await contractInstance.getTrade(1);
            assert.equal(trade.closed, true);
            let owner = await contractInstance.ownerOf(0);
            assert.equal(owner, acc2);
        });
        it('should be able to close trade', async () => {
            await contractInstance.safeMint(acc2, '0', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            
            await contractInstance.closeTrade(1, {from: acc1});
            let trade = await contractInstance.getTrade(1);
            assert.equal(trade.closed, true);
            let owner = await contractInstance.ownerOf(0);
            assert.equal(owner, acc2);
        });
        it('should be able to trade many cards', async () => {
            await contractInstance.safeMint(acc1, '0', 0, {from: acc1});
            await contractInstance.safeMint(acc1, '1', 0, {from: acc1});
            await contractInstance.safeMint(acc1, '2', 0, {from: acc1});
    
            await contractInstance.safeMint(acc2, '3', 0, {from: acc1});
            await contractInstance.safeMint(acc2, '4', 0, {from: acc1});
    
            assert.equal(await contractInstance.ownerOf(0), acc1);
            assert.equal(await contractInstance.ownerOf(1), acc1);
            assert.equal(await contractInstance.ownerOf(2), acc1);
            assert.equal(await contractInstance.ownerOf(3), acc2);
            assert.equal(await contractInstance.ownerOf(4), acc2);
    
            await contractInstance.makeTradeOffer(acc2, [0, 1, 2], [3, 4], {from: acc1});
            await contractInstance.acceptTrade(1, {from: acc2});
    
            assert.equal(await contractInstance.ownerOf(0), acc2);
            assert.equal(await contractInstance.ownerOf(1), acc2);
            assert.equal(await contractInstance.ownerOf(2), acc2);
            assert.equal(await contractInstance.ownerOf(3), acc1);
            assert.equal(await contractInstance.ownerOf(4), acc1);
    
            let trade = await contractInstance.getTrade(1);
            assert.equal(trade.closed, true);
        });
        it('should not be able to offer a card you don\'t own', async () => {
            await contractInstance.safeMint(acc2, '', 0, {from: acc1});
            utils.shouldThrow(contractInstance.makeTradeOffer(acc2, [0], [], {from: acc1}));
        });
        it('should not be able to accept a trade not meant for you', async () => {
            await contractInstance.safeMint(acc2, '', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            utils.shouldThrow(contractInstance.acceptTrade(1, {from: acc1}));
        });
        it('should not be able to get a non-existing trade', async () => {
            utils.shouldThrow(contractInstance.closeTrade(10, {from: acc1}));
        });
        it('should start with 0 trades on the card', async () => {
            let res = await contractInstance.stats(0);
            assert.equal(res.traded, 0);
        });
        it('should increment the trading amount on the card', async () => {
            await contractInstance.safeMint(acc2, '', 0, {from: acc1});
            await contractInstance.makeTradeOffer(acc2, [], [0], {from: acc1});
            await contractInstance.acceptTrade(1, {from: acc2});

            let res = await contractInstance.stats(0);
            assert.equal(res.traded, 1);
        });
    });
    

    // #####################################################################
    // ######################### TESTING PACKS  ############################
    // #####################################################################
    context('Packs', async () => {
        it('should not be able to get a pack for free', async () => {
            utils.shouldThrow(contractInstance.buyPackOfTen(acc1, {from: acc1, value: 0}));
        });
        it('should be able to change the price of a pack', async () => {
            await contractInstance.buyPackOfTen(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
            await contractInstance.setPackCost(web3.utils.toWei('0.2', 'ether'), {from: acc1});
            utils.shouldThrow(contractInstance.buyPackOfTen(acc1, {from: acc1, value: web3.utils.toWei('0.1', 'ether')}));
            assert.equal(await contractInstance.getPackCost(), web3.utils.toWei('0.2', 'ether'));
        });
        context('Buying', async () => {
            it('should only be able to buy a pack if registered', async () => {
                utils.shouldThrow(contractInstance.buyPackOfTen(acc3, {from: acc3, value: web3.utils.toWei('1', 'ether')}));
            });
            it('should be able to buy a pack of 10', async () => {
                await contractInstance.buyPackOfTen(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
                assert(await contractInstance.balanceOf(acc1), 10);
            });
            it('should be able to buy a pack of 20', async () => {
                await contractInstance.buyPackOfTwenty(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
                assert(await contractInstance.balanceOf(acc1), 20);
            });
            it('should be able to buy a pack of 50', async () => {
                await contractInstance.buyPackOfFifty(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
                assert(await contractInstance.balanceOf(acc1), 50);
            });
            it('should be able to buy different packs (10 + 20)', async () => {
                await contractInstance.buyPackOfTen(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
                await contractInstance.buyPackOfTwenty(acc1, {from: acc1, value: web3.utils.toWei('1', 'ether')});
                assert(await contractInstance.balanceOf(acc1), 30);
            });
            it('should be able to buy a pack if you are not the owner', async () => {
                await contractInstance.buyPackOfTen(acc2, {from: acc2, value: web3.utils.toWei('1', 'ether')});
                assert(await contractInstance.balanceOf(acc2), 10);
            });
        });
    });
});
