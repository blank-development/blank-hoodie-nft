// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const { ethers } = require('ethers');

async function main() {
  try {
    const BlankNFT = await hre.ethers.getContractFactory('BlankNFT');
    const blankNFT = await BlankNFT.deploy(
      'https://storage.googleapis.com/blank-nft/'
    );

    await blankNFT.deployed();

    console.log(
      '\x1b[42m',
      'BlankNFT deployed to:',
      blankNFT.address,
      '\x1b[0m',
    );
  } catch (err) {
    console.log('\x1b[41m', 'Something wrong with the address', '\x1b[0m');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
