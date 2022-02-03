const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BlankMetaBuilderHoodie', function () {
  let blankNFT;
  let owner, user, user2;

  const deploy = async () => {
    [owner, user, user2] = await ethers.getSigners();

    const BlankMetaBuilderHoodie = await ethers.getContractFactory(
      'BlankMetaBuilderHoodie'
    );
    blankNFT = await BlankMetaBuilderHoodie.deploy();
    await blankNFT.deployed();
  };

  describe('Initial state', function () {
    beforeEach(deploy);

    it('should return correct name', async function () {
      expect(await blankNFT.name()).to.equal('BlankMetaBuilderHoodie');
    });

    it('should return correct symbol', async function () {
      expect(await blankNFT.symbol()).to.equal('HOODIE');
    });

    it('should have owner', async function () {
      expect(await blankNFT.owner()).to.equal(owner.address);
    });
  });

  describe('Mint', function () {
    beforeEach(deploy);

    it('shoud mint successfully', async function () {
      await blankNFT.mint(1, {
        value: ethers.utils.parseUnits('0.2'),
      });

      expect(await blankNFT.balanceOf(owner.address)).to.equal(1);
      expect(await blankNFT.totalSupply()).to.equal(1);
      expect(
        (await blankNFT.provider.getBalance(blankNFT.address)).toString()
      ).to.equal(ethers.utils.parseUnits('0.2'));
      expect(await blankNFT.tokenURI(0)).to.equal(
        'ipfs://QmTm1wwZmUGxVa5Mhhye4bkoo3azWUGtnUfmEB99PoRMQZ'
      );
    });

    it('shoud mint max amount', async function () {
      await blankNFT.mint(10, {
        value: ethers.utils.parseUnits('2'),
      });

      expect(await blankNFT.balanceOf(owner.address)).to.equal(10);
      expect(await blankNFT.totalSupply()).to.equal(10);
    });

    it('shoud fail to mint above max amount', async function () {
      await expect(
        blankNFT.mint(11, {
          value: ethers.utils.parseUnits('2.2'),
        })
      ).to.be.revertedWith('No more than 10 per tx');
    });

    it('shoud fail to mint with invalid price', async function () {
      await expect(
        blankNFT.mint(1, {
          value: ethers.utils.parseUnits('0.01'),
        })
      ).to.be.revertedWith('Not enough ether sent');
    });
  });

  describe('Owner actions', () => {
    beforeEach(deploy);

    it('shoud airdrop when owner', async function () {
      await blankNFT.airdrop([user.address, user2.address], [1, 2]);

      expect(await blankNFT.balanceOf(user.address)).to.equal(1);
      expect(await blankNFT.balanceOf(user2.address)).to.equal(2);
      expect(await blankNFT.totalSupply()).to.equal(3);
    });

    it('shoud fail to airdrop when not owner', async function () {
      await expect(
        blankNFT.connect(user).airdrop([user.address, user2.address], [1, 2])
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('shoud change price when owner', async function () {
      await blankNFT.setPrice(ethers.utils.parseUnits('0.01'));
      await blankNFT.mint(1, {
        value: ethers.utils.parseUnits('0.01'),
      });
      expect(await blankNFT.balanceOf(owner.address)).to.equal(1);
    });

    it('shoud fail to change price when not owner', async function () {
      await expect(
        blankNFT.connect(user).setPrice(ethers.utils.parseUnits('0.01'))
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
