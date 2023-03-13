// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract OverflowTest {
    uint8 public counter;

    function increment(uint8 amount) public {
        counter += amount;
    }

    function forceIncrement(uint8 amount) public {
        unchecked {
            counter += amount;
        }
    }
}
