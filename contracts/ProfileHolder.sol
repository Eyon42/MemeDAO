// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/TransparentUpgradeableProxy.sol)

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';
import {LensHub} from './core/LensHub.sol';

contract ProfileHolder {
    address lensHubAddress;
    address collectModuleAddress;
    uint256 public profile_id;
    string chosenMemeURI;
    uint256 lastPostTime;
    LensHub lensHub;
    uint256 postCooldown;
    string handle;
    bool created = false;
    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Forbidden');
        _;
    }

    modifier onlyMember() {
        require(true); // TODO
        _;
    }

    constructor(
        address _LensHub,
        address _collectModule,
        uint256 _postCooldown,
        string memory _handle
    ) {
        owner = msg.sender;
        lensHubAddress = _LensHub;
        collectModuleAddress = _collectModule;
        lensHub = LensHub(lensHubAddress);
        handle = _handle;
        postCooldown = _postCooldown;
        lastPostTime = 0;
    }

    function createProfile() public onlyOwner {
        require(!created, 'The profile has already been created');
        lensHub.createProfile(
            DataTypes.CreateProfileData(
                address(this),
                handle,
                'https://static.wikia.nocookie.net/memes-pedia/images/d/df/Nada.png/revision/latest/scale-to-width-down/797?cb=20201119214705&path-prefix=es', // Not Ipfs :(
                address(0), // TODO
                '',
                'https://static.wikia.nocookie.net/memes-pedia/images/d/df/Nada.png/revision/latest/scale-to-width-down/797?cb=20201119214705&path-prefix=es'
            )
        );
        profile_id = lensHub.getProfileIdByHandle(handle);
        created = true;
    }

    function setMeme(string calldata _meme) public onlyOwner {
        require(created, 'No profile has been created');
        chosenMemeURI = _meme;
    }

    function postMeme() public onlyMember {
        require(created, 'No profile has been created');
        require(
            block.timestamp - lastPostTime > postCooldown,
            'Wait until the post cooldown is reached'
        );
        lensHub.post(
            DataTypes.PostData(
                profile_id,
                chosenMemeURI,
                collectModuleAddress, // collectModule, TODO
                '', // collectModuleData,
                address(0), // referenceModule, TODO
                '' // referenceModuleData,
            )
        );
        lastPostTime = block.timestamp;
    }
}
