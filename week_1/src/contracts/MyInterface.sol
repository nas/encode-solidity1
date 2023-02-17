// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface MyInterface {
    function helloWorld() external view returns (string memory);

    function potato() external;

    function setText(string calldata newText) external;
}
