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

  describe('Create', async function () {
    beforeEach(deploy);

    it('should create new token', async () => {
      await blankNFT.create(100, ethers.utils.parseUnits('1'), 'dummyHash');
      expect(await blankNFT.maxSupply(3)).to.equal(100);
      expect(await blankNFT.uri(3)).to.equal('ipfs://dummyHash');
    });

    it('should fail to create new token if not owner', async () => {
      await expect(
        blankNFT
          .connect(userTwo)
          .create(100, ethers.utils.parseUnits('1'), 'dummyHash')
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
