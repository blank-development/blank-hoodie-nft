const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BlankNFT', function () {
  let blankNFT;
  let owner, user, userTwo;

  const deploy = async () => {
    [owner, user, userTwo] = await ethers.getSigners();

    const BlankNFT = await ethers.getContractFactory('BlankNFT');
    blankNFT = await BlankNFT.deploy();
    await blankNFT.deployed();
  };

  describe('Initial state', function () {
    beforeEach(deploy);

    it('should return correct name', async function () {
      expect(await blankNFT.name()).to.equal('BlankNFT');
    });

    it('should return correct symbol', async function () {
      expect(await blankNFT.symbol()).to.equal('BNFT');
    });

    it('should create logo nft', async function () {
      expect(await blankNFT.balanceOf(owner.address, 1)).to.equal(1);
      expect(await blankNFT.maxSupply(1)).to.equal(1);
      expect(await blankNFT.uri(1)).to.equal(
        'ipfs://QmWpHc26bQNmg5NcLHhQKE8Nuo768FmnJhjcjBvWaZdqgu'
      );
    });

    it('should create hoodie nft', async function () {
      expect(await blankNFT.maxSupply(2)).to.equal(500);
      expect(await blankNFT.uri(2)).to.equal(
        'ipfs://QmTm1wwZmUGxVa5Mhhye4bkoo3azWUGtnUfmEB99PoRMQZ'
      );
    });
  });

  describe('Mint', function () {
    beforeEach(deploy);

    it('shoud mint successfully', async function () {
      await blankNFT.mint(2, 1, {
        value: ethers.utils.parseUnits('0.1'),
      });

      expect(await blankNFT.balanceOf(owner.address, 2)).to.equal(1);
    });

    it('shoud fail to mint with invalid price', async function () {
      await expect(
        blankNFT.mint(2, 1, {
          value: ethers.utils.parseUnits('0.01'),
        })
      ).to.be.revertedWith('Not enough ETH sent');
    });

    it('shoud fail to mint invalid id', async function () {
      await expect(
        blankNFT.mint(3, 1, {
          value: ethers.utils.parseUnits('0.01'),
        })
      ).to.be.revertedWith('Invalid token ID');

      await expect(
        blankNFT.mint(1, 1, {
          value: ethers.utils.parseUnits('0.01'),
        })
      ).to.be.revertedWith('Total supply reached');
    });

    it('should mint for free when owner', async function () {
      await blankNFT.mintOwner(2, user.address, 1);
      expect(await blankNFT.balanceOf(user.address, 2)).to.equal(1);
    });

    it('should fail to mint for free when not owner', async function () {
      await expect(
        blankNFT.connect(user).mintOwner(2, user.address, 1)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Whitelist', function () {
    beforeEach(deploy);

    it('should should add to whitelist if owner', async () => {
      await blankNFT.addToWhitelist([
        { claimer: user.address, tokenId: 2, amount: 1 },
        { claimer: userTwo.address, tokenId: 2, amount: 2 },
      ]);

      const wl1 = await await blankNFT.whitelisters(user.address);
      expect(wl1.claimer).to.equal(user.address);
      expect(wl1.tokenId).to.equal('2');
      expect(wl1.amount).to.equal('1');

      const wl2 = await await blankNFT.whitelisters(userTwo.address);
      expect(wl2.claimer).to.equal(userTwo.address);
      expect(wl2.tokenId).to.equal('2');
      expect(wl2.amount).to.equal('2');
    });

    it('should mint for free if whitelisted', async () => {
      await blankNFT.addToWhitelist([
        { claimer: userTwo.address, tokenId: 2, amount: 2 },
      ]);

      await blankNFT.connect(userTwo).mintWhitelist();
      expect(await blankNFT.balanceOf(userTwo.address, 2)).to.equal(2);

      const wl2 = await await blankNFT.whitelisters(userTwo.address);
      expect(wl2.claimer).to.equal(
        '0x0000000000000000000000000000000000000000'
      );
      expect(wl2.tokenId).to.equal('0');
      expect(wl2.amount).to.equal('0');

      await expect(
        blankNFT.connect(userTwo).mintWhitelist()
      ).to.be.revertedWith('Nothing to claim');
    });
  });

  describe('Create', async function () {
    beforeEach(deploy);

    it('should create new token', async () => {
      await blankNFT.create(100, ethers.utils.parseUnits('1'), 'uri');
      expect(await blankNFT.maxSupply(3)).to.equal(100);
      expect(await blankNFT.uri(3)).to.equal('ipfs://uri');
    });
  });
});
