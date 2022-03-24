pragma solidity 0.8.10;

import {IReferenceModule} from '../../../interfaces/IReferenceModule.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {LensHub} from '../../LensHub.sol';
import {TwoWayReferenceModule} from './TwoWayReferenceModule.sol';

contract ReactionsModule is TwoWayReferenceModule {
    constructor(address hub) TwoWayReferenceModule(hub) {}

    function getNumberOfReactions(
        uint256 profileId,
        uint256 pubId,
        string memory _reactionCode
    ) public view returns (uint256) {
        LensHub lensHub = LensHub(HUB);
        uint256 reactions = 0;
        uint256 nRef = getNumberOfReferences(profileId, pubId);
        for (uint256 i = 0; i < nRef; i++) {
            (uint256 refProfileId, uint256 refPubId) = getReferences(profileId, pubId, i);
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
