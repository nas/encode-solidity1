// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract SortedBallot {
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function sortProposals() public {
        uint256 i = 1;
        uint256 sorted = 0;
        while (true) {
            Proposal memory prevObj = proposals[i - 1];
            if (uint256(prevObj.name) > uint256(proposals[i].name)) {
                proposals[i - 1] = proposals[i];
                proposals[i] = prevObj;
                sorted++;
            }
            i++;
            if (i >= proposals.length) {
                if (sorted == 0) break;
                sorted = 0;
                i = 1;
            }
        }
    }
}
