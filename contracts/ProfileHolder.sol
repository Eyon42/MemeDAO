// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/TransparentUpgradeableProxy.sol)

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';
import {LensHub} from './core/LensHub.sol';

contract ProfileHolder {
    LensHub lensHub;
    address lensHubAddress;
    address collectModuleAddress;
    address referenceModuleAddress;
    address followModuleAddress;

    address owner;

    uint256 public profile_id = 0; //lens protocol does not mint NFTs with 0, it's used to signify an uninitialized variable.
    string public handle;

    string chosenMemeURI;
    uint256 lastPostTime;
    uint256 postCooldown;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Forbidden');
        _;
    }

    modifier onlyOnceCreated() {
        require(profile_id != 0, 'No profile has been created');
        _;
    }

    modifier onlyMember() {
        require(true); // TODO
        _;
    }

    constructor(
        address _LensHub,
        address _collectModule,
        address _referenceModule,
        address _followModule,
        uint256 _postCooldown,
        string memory _handle
    ) {
        owner = msg.sender;
        lensHubAddress = _LensHub;
        collectModuleAddress = _collectModule;
        referenceModuleAddress = _referenceModule;
        followModuleAddress = _followModule;
        lensHub = LensHub(lensHubAddress);
        handle = _handle;
        postCooldown = _postCooldown;
        lastPostTime = 0;
    }

    function createProfile() public onlyOwner {
        require(profile_id == 0, 'The profile has already been created');
        lensHub.createProfile(
            DataTypes.CreateProfileData(
                address(this),
                handle,
                'https://static.wikia.nocookie.net/memes-pedia/images/d/df/Nada.png/revision/latest/scale-to-width-down/797?cb=20201119214705&path-prefix=es', // Not Ipfs :(
                followModuleAddress,
                '', // TODO
                'https://static.wikia.nocookie.net/memes-pedia/images/d/df/Nada.png/revision/latest/scale-to-width-down/797?cb=20201119214705&path-prefix=es'
            )
        );
        profile_id = lensHub.getProfileIdByHandle(handle);
    }

    function setMeme(string calldata _meme) public onlyOwner onlyOnceCreated {
        chosenMemeURI = _meme;
    }

    function postMeme() public onlyMember onlyOnceCreated {
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
                referenceModuleAddress,
                '' // referenceModuleData,
            )
        );
        lastPostTime = block.timestamp;
    }

    // Setting addresses for modules
    function setCollectModuleAddress(address _newAddress) public onlyOwner {
        collectModuleAddress = _newAddress;
    }

    function setFollowModuleAddress(address _newAddress) public onlyOwner {
        followModuleAddress = _newAddress;
    }

    function setReferenceModuleAddress(address _newAddress) public onlyOwner {
        referenceModuleAddress = _newAddress;
    }
}
