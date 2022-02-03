const hre = require('hardhat');
const { ethers } = require('ethers');

async function main() {
  try {
    const BlankMetaBuilderHoodie = await hre.ethers.getContractFactory(
      'BlankMetaBuilderHoodie'
    );
    const blankMetaBuilderHoodie = await BlankMetaBuilderHoodie.deploy();
    await blankMetaBuilderHoodie.deployed();

    console.log(
      '\x1b[42m',
      'BlankMetaBuilderHoodie deployed to:',
      blankMetaBuilderHoodie.address,
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
