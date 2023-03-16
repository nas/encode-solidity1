//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Random {
    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.prevrandao;
    }

    function tossCoin() public view returns (bool heads) {
        heads = getRandomNumber() % 2 == 0;
    }
}
