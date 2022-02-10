const hre = require('hardhat');
const { ethers } = require('ethers');

const addresses = [
  '0xB330D743ea709abE6248B4a1015A65837dc57960',
  '0x65F6dEad807491a93030aB455BC91187Fbf3AAF9',
  '0xB65dbff4079d8B17087Ff2B31dAD5cc3766623af',
  '0xc69F540BDCDAfbfEC8dFabFAEC610606A4a969f6',
  '0x4f93b3c158e4808c7dfdC98ea6866AfE9CC6180C',
  '0xA1f4e6E3c0E770D960b5F350905ce3CaE9938acF',
  '0x023C9A688cF79B2ea0c84204551bbFD3f6367A27',
  '0x7965fFc8c7A216E06142FB46Bae8c3f90d603F21',
  '0xEF7E276dBd04a867708Ef0b8D8B35674662580CD',
  '0x03588F76D3367836d7F257D8903F4d409CBEAF0D',
  '0x9823b7C29afb03dEDbB104cf34632D93D0bd4366',
  '0x1840537e947C3b1c7b3d64eC35baF707548f6618',
  '0x81807481CA727Dd02649a36076B29A32E49Db472',
  '0xc49B19A7Ca0503250c306cF0EA61e91E684e32FA',
  '0x674053d516466141179271A33Bd16edCA1119BdC',
  '0xe258C666DB0ead5294933661472A2824d422D779',
];
const amounts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

async function main() {
  try {
    const BlankMetaBuilderHoodie = await hre.ethers.getContractFactory(
      'BlankMetaBuilderHoodie'
    );
    const blankMetaBuilderHoodie = await BlankMetaBuilderHoodie.attach(
      '0x4dDe4F255A3329AE5d5E44F86A561023fd8B9440'
    );

    const tx = await blankMetaBuilderHoodie.airdrop(addresses, amounts);

    console.log('Airdrop done', tx);
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
