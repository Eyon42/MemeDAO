// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

/**
 * @title PublishingLogic
 * @author Lens Protocol
 *
 * @notice This is the library that contains the logic for profile creation & publication.
 *
 * @dev The functions are external, so they are called from the hub via `delegateCall` under the hood. Furthermore,
 * expected events are emitted from this library instead of from the hub to alleviate code size concerns.
 */
library PublishingLogic {

    function getNumberOfReactions(
        uint256 profileId,
        uint256 pubId,
        string memory _reactionCode
        ) public view return (uint256) 
    {
        uint256 reactions = 0;
        nRef = twrModule.getNumberOfReferences(profileId, pubId);
        for (uint256 i = 0; i < nRef; i++) {
            refProfileId, refPubId = twrModule.getReferences(profileId, pubId, i);
            string memory _commentCode = lensHub.getContentURI(refProfileId, refPubId);    
            if (keccak256(_reactionCode) == keccak256(_commentCode)) {
                reactions = reactions + 1;
            }
        }

        return reactions;

    }

}
