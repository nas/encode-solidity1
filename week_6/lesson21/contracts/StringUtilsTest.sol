// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import {Strings} from "./imported/solidity-utils_imported.sol";

contract StringUtilsTest {
    using Strings for string;
    string public stored1;
    string public stored2;
    bool public stringsEqual;

    function concatenateUsingAbiEncode(string memory s1, string memory s2)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(s1, s2));
    }

    function concatenateUsingLibrary(string memory s1, string memory s2)
        internal
        pure
        returns (string memory)
    {
        return s1.concat(s2);
    }

    function concatenateAndSaveUsingAbiEncode(
        string calldata s1,
        string calldata s2
    ) public {
        stored1 = concatenateUsingAbiEncode(s1, s2);
    }

    function concatenateAndSaveUsingLibrary(
        string calldata s1,
        string calldata s2
    ) public {
        stored2 = concatenateUsingLibrary(s1, s2);
    }

    function compareUsingAbiEncode(string storage s1, string storage s2)
        internal
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function compareUsingLibrary(string storage s1, string storage s2)
        internal
        pure
        returns (bool)
    {
        return s1.compareTo(s2);
    }

    function compareAndSaveUsingAbiEncode() public {
        stringsEqual = compareUsingAbiEncode(stored1, stored2);
    }

    function compareAndSaveUsingLibrary() public {
        stringsEqual = compareUsingLibrary(stored1, stored2);
    }
}
