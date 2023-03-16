//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PseudoRandom {
    using ECDSA for bytes32;

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    Signature savedSig;

    function setSignature(uint8 _v, bytes32 _r, bytes32 _s) public {
        savedSig = Signature({v: _v, r: _r, s: _s});
    }

    function getRandomNumber(
        string calldata seed
    ) public view returns (uint256 pseudoRandomNumber) {
        address messageSigner = verifyString(
            seed,
            savedSig.v,
            savedSig.r,
            savedSig.s
        );
        require(msg.sender == messageSigner, "Invalid seed");
        pseudoRandomNumber = uint256(keccak256(abi.encodePacked(seed)));
    }

    function getCombinedRandomNumber(
        string calldata seed
    ) public view returns (uint256 pseudoRandomNumber) {
        address messageSigner = verifyString(
            seed,
            savedSig.v,
            savedSig.r,
            savedSig.s
        );
        require(msg.sender == messageSigner, "Invalid seed");
        pseudoRandomNumber = uint256(
            keccak256(abi.encodePacked(seed, blockhash(block.number - 1)))
        );
    }

    // Don't worry about this function for now
    function verifyString(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address signer) {
        string memory header = "\x19Ethereum Signed Message:\n000000";
        uint256 lengthOffset;
        uint256 length;
        assembly {
            length := mload(message)
            lengthOffset := add(header, 57)
        }
        require(length <= 999999);
        uint256 lengthLength = 0;
        uint256 divisor = 100000;
        while (divisor != 0) {
            uint256 digit = length / divisor;
            if (digit == 0) {
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }
            lengthLength++;
            length -= digit * divisor;
            divisor /= 10;
            digit += 0x30;
            lengthOffset++;
            assembly {
                mstore8(lengthOffset, digit)
            }
        }
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }
        assembly {
            mstore(header, lengthLength)
        }
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return ecrecover(check, v, r, s);
    }
}
