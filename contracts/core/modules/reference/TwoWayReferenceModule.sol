pragma solidity 0.8.10;

import {ModuleBase} from '../ModuleBase.sol';
import {LensHub} from '../../LensHub.sol';

contract TwoWayReferenceModule is ModuleBase {
    constructor(address hub) ModuleBase(hub) {}

    struct PubIdTuple {
        uint256 user;
        uint256 publication;
    }

    mapping(uint256 => mapping(uint256 => PubIdTuple[])) basePubToRef;

    /**
     * @notice Initializes data for a given publication being published. This can only be called by the hub.
     * @param profileId The token ID of the profile publishing the publication.
     * @param pubId The associated publication's LensHub publication ID.
     * @param data Arbitrary data passed from the user to be decoded.
     *
     * @return An abi encoded byte array encapsulating the execution's state changes. This will be emitted by the
     * hub alongside the collect module's address and should be consumed by front ends.
     */
    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external onlyHub returns (bytes memory) {
        return data;
    }

    /**
     * @notice Processes a comment action referencing a given publication. This can only be called by the hub.
     *
     * @param profileId The token ID of the profile associated with the publication being published.
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     */
    function processComment(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed
    ) external onlyHub {
        _recordReference(profileId, profileIdPointed, pubIdPointed);
    }

    /**
     * @notice Processes a mirror action referencing a given publication. This can only be called by the hub.
     *
     * @param profileId The token ID of the profile associated with the publication being published.
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     */
    function processMirror(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed
    ) external onlyHub {
        _recordReference(profileId, profileIdPointed, pubIdPointed);
    }

    /**
     * @notice Stores the back references. Exposed for incorporation in other contracts.
     *
     * @param profileId The token ID of the profile associated with the publication being published.
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     */
    function _recordReference(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed
    ) private {
        LensHub lensHub = LensHub(HUB);
        uint256 pubId = lensHub.getPubCount(profileId) + 1; // Not yet increased in the Hub

        PubIdTuple memory refPubIdTuple = PubIdTuple(profileId, pubId);
        basePubToRef[profileIdPointed][pubIdPointed].push(refPubIdTuple);
    }

    /**
     * @notice Returns references for a given publication. Exposed for incorporation in other contracts.
     *
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     * @param refId The index of the referencing publication by reference order.
     */
    function getReferences(
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        uint256 refId
    ) public view returns (uint256, uint256) {
        PubIdTuple memory refPubIdTuple = basePubToRef[profileIdPointed][pubIdPointed][refId];
        return (refPubIdTuple.user, refPubIdTuple.publication);
    }

    /**
     * @notice Returns number references for a given publication. Exposed for incorporation in other contracts.
     *
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     */
    function getNumberOfReferences(uint256 profileIdPointed, uint256 pubIdPointed)
        public
        view
        returns (uint256)
    {
        return basePubToRef[profileIdPointed][pubIdPointed].length;
    }
}
