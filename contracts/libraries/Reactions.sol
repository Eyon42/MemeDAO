// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

import {LensHub} from '../core/LensHub.sol';
import {TwoWayReferenceModule} from '../core/modules/reference/TwoWayReferenceModule.sol';

/**
 * @title Reactions
 * @author Francesco Genile
 *
 * @notice This is the library that contains functions to manage reactions as references.
 *
 * @dev The functions are external, so they are called from the parent contract via `delegateCall` under the hood.
 */
library Reactions {
    function getNumberOfReactions(
        uint256 profileId,
        uint256 pubId,
        string memory _reactionCode,
        LensHub lensHub,
        TwoWayReferenceModule twrModule
    ) external view returns (uint256) {
        uint256 reactions = 0;
        uint256 nRef = twrModule.getNumberOfReferences(profileId, pubId);
        for (uint256 i = 0; i < nRef; i++) {
            (uint256 refProfileId, uint256 refPubId) = twrModule.getReferences(profileId, pubId, i);
            string memory _commentCode = lensHub.getContentURI(refProfileId, refPubId);
            if (
                keccak256(abi.encodePacked(_reactionCode)) ==
                keccak256(abi.encodePacked(_commentCode))
            ) {
                reactions = reactions + 1;
            }
        }
        return reactions;
    }
}
