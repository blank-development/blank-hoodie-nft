//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract BlankNFT is ERC1155Supply, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenCounter;

  string public name = "BlankNFT";
  string public symbol = "BNFT";

  // Token ID -> Max supply of each NFT
  mapping(uint256 => uint256) public maxSupply;

  // Token ID -> Price in Ether
  mapping(uint256 => uint256) public pricesETH;

  // Whitelisting: Address -> struct describing claim
  mapping(address => WhitelistEntry) public whitelisters;

  // Token ID -> URI
  mapping (uint256 => string) tokenUris;

  struct WhitelistEntry {
    address claimer;
    uint256 tokenId;
    uint256 amount;
  }

  constructor() ERC1155("ipfs://") {
    // logo
    uint256 logoTokenId = create(1, 0 ether, "QmWpHc26bQNmg5NcLHhQKE8Nuo768FmnJhjcjBvWaZdqgu");
    mintOwner(logoTokenId, _msgSender(), 1);

    // hoodie
    create(500, 0.1 ether, "QmTm1wwZmUGxVa5Mhhye4bkoo3azWUGtnUfmEB99PoRMQZ");
  }

  modifier whenIdExists(uint256 id) {
    require(id > 0 && id <= _tokenCounter.current(), 'Invalid token ID');
    _;
  }

  function mint(
    uint256 tokenId,
    uint256 amount
  ) external payable whenIdExists(tokenId) {
    require(msg.value >= (amount.mul(pricesETH[tokenId])), 'Not enough ETH sent');
    _mintForAddress(_msgSender(), tokenId, amount);
  }

  function mintOwner(
    uint256 tokenId,
    address recipient,
    uint256 amount
  ) public whenIdExists(tokenId) onlyOwner {
    _mintForAddress(recipient, tokenId, amount);
  }

  function mintWhitelist() external {
    require(whitelisters[_msgSender()].amount > 0, 'Nothing to claim');
    uint256 tokenId = whitelisters[_msgSender()].tokenId;
    uint256 amountToMint = whitelisters[_msgSender()].amount;
    delete whitelisters[_msgSender()];
    _mintForAddress(_msgSender(), tokenId, amountToMint);
  }

  function create(uint256 supply, uint256 price, string memory tokenURI)
    public
    onlyOwner
    returns (uint256)
  {
    _tokenCounter.increment();
    uint256 tokenId = _tokenCounter.current();

    maxSupply[tokenId] = supply;
    pricesETH[tokenId] = price;
    tokenUris[tokenId] = tokenURI;

    return tokenId;
  }

  function addToWhitelist(WhitelistEntry[] calldata whitelistInfo)
    external
    onlyOwner
  {
    for (uint256 i = 0; i < whitelistInfo.length; i++) {
      require(
        whitelistInfo[i].tokenId > 0 &&
          whitelistInfo[i].tokenId <= _tokenCounter.current(),
        'Wrong ID'
      );
      whitelisters[whitelistInfo[i].claimer] = whitelistInfo[i];
    }
  }

  function changePrice(uint256 tokenId, uint256 newPrice)
    external
    whenIdExists(tokenId)
    onlyOwner
  {
    pricesETH[tokenId] = newPrice;
  }

  function uri(
    uint256 _id
  ) override whenIdExists(_id) public view returns (string memory) {
    return string(abi.encodePacked(super.uri(_id), tokenUris[_id]));
  }

  function withdrawFunds() external onlyOwner {
    payable(_msgSender()).transfer(address(this).balance);
  }

  function _mintForAddress(
    address recipient,
    uint256 tokenId,
    uint256 amount
  ) private {
    require(
      (totalSupply(tokenId).add(amount)) <= maxSupply[tokenId],
      'Total supply reached'
    );
    _mint(recipient, tokenId, amount, "");
  }
}
