// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import {MyInterface} from "./MyInterface.sol";

contract Greeter {
    function invokeGreeting(
        address target
    ) external view returns (string memory) {
        return MyInterface(target).helloWorld();
    }

    function modifyGreeting(address target, string calldata newText) external {
        MyInterface(target).setText(newText);
    }

    function invokeFallback(address target) external {
        MyInterface(target).potato();
    }
}
