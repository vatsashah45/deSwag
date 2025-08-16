// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNft is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("MyBaseSepoliaNFT", "MBSN") Ownable(msg.sender) {}

    /// @notice Owner mints to any address with a tokenURI (e.g., IPFS or Walrus URL)
    function mintTo(address to, string memory tokenURI_) external onlyOwner {
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    /// @notice Anyone can mint an NFT to themselves with a tokenURI
    function publicMint(string memory tokenURI_) external {
        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }
}
