const hre = require('hardhat');
const { ethers } = require('ethers');

async function main() {
  try {
    const BlankNFT = await hre.ethers.getContractFactory('BlankNFT');
    const blankNFT = await BlankNFT.deploy();
    await blankNFT.deployed();

    console.log(
      '\x1b[42m',
      'BlankNFT deployed to:',
      blankNFT.address,
      '\x1b[0m'
    );
  } catch (err) {
    console.log('\x1b[41m', 'Something wrong with the address', '\x1b[0m');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
