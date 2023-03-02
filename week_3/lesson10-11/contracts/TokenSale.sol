// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMyToken is IERC20 {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

interface IMyNFT {
    function safeMint(address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;
}

contract TokenSale is Ownable {
    uint256 public ratio;
    uint256 public price;
    uint256 public withdrawableAmount;
    IMyToken public tokenAddress;
    IMyNFT public nftAddress;

    constructor(
        uint256 _ratio,
        uint256 _price,
        address _tokenAddress,
        address _nftAddress
    ) {
        ratio = _ratio;
        price = _price;
        tokenAddress = IMyToken(_tokenAddress);
        nftAddress = IMyNFT(_nftAddress);
    }

    function buyTokens() external payable {
        tokenAddress.mint(msg.sender, msg.value * ratio);
    }

    function burnTokens(uint256 amount) external {
        tokenAddress.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / ratio);
    }

    function buyNFT(uint256 tokenId) external {
        tokenAddress.transferFrom(msg.sender, address(this), price);
        nftAddress.safeMint(msg.sender, tokenId);
        withdrawableAmount += price / 2;
    }

    function burnNFT(uint256 tokenId) external {
        nftAddress.burn(tokenId);
        tokenAddress.transfer(msg.sender, price - (price / 2));
    }

    function withdraw(uint256 amount) external onlyOwner {
        withdrawableAmount -= amount;
        tokenAddress.transfer(owner(), amount);
    }
}
