// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;

    constructor() {
        text = pureText();
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function receiveValue(
        string calldata myValue
    ) public pure returns (string memory) {
        return myValue;
    }

    function setText(string calldata newText) public payable {
        text = newText;
    }

    function pureText() public pure returns (string memory) {
        return "Hello World";
    }

    function _isPure() internal view returns (bool check_) {
        check_ = keccak256(bytes(text)) == keccak256(bytes(pureText()));
    }

    function isPure() public view returns (bool returnValue_) {
        returnValue_ = _isPure();
    }

    function _restore() internal {
        text = pureText();
    }

    function restore() public onlyWhenNotPureText {
        _restore();
    }

    fallback() external {
        text = "Method does not exist, using fallback";
    }

    modifier onlyWhenNotPureText() {
        require(!isPure(), "The return value is unchanged");
        _;
    }
}
