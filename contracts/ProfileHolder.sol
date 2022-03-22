// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/TransparentUpgradeableProxy.sol)

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';
import {LensHub} from './core/LensHub.sol';
import {ReactionsModule} from './core/modules/reference/ReactionsModule.sol';

contract ProfileHolder {
    LensHub lensHub;
    address lensHubAddress;
    address auctionCollectModuleAddress;
    address emptyCollectModuleAddress;
    address referenceModuleAddress;
    address followModuleAddress;

    address owner;

    uint256 public profileId = 0; //lens protocol does not mint NFTs with 0, it's used to signify an uninitialized variable.
    string public handle;

    string memeRequestPostURI;
    string chosenMemeURI;
    uint256 lastPostTime;
    uint256 postCooldown;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Forbidden');
        _;
    }

    modifier onlyOnceCreated() {
        require(profileId != 0, 'No profile has been created');
        _;
    }

    modifier onlyMember() {
        require(true); // TODO
        _;
    }

    constructor(
        address _LensHub,
        address _auctionCollectModule,
        address _emptyCollectModule,
        address _referenceModule,
        address _followModule,
        uint256 _postCooldown,
        string memory _handle
    ) {
        owner = msg.sender;
        lensHubAddress = _LensHub;
        auctionCollectModuleAddress = _auctionCollectModule;
        emptyCollectModuleAddress = _emptyCollectModule;
        referenceModuleAddress = _referenceModule;
        followModuleAddress = _followModule;
        lensHub = LensHub(lensHubAddress);
        handle = _handle;
        postCooldown = _postCooldown;
        lastPostTime = 0;
    }

    function createProfile() public onlyOwner {
        require(profileId == 0, 'The profile has already been created');
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
        profileId = lensHub.getProfileIdByHandle(handle);
        _postPrivateMemeRequest();
    }

    function _setMeme() private onlyOnceCreated {
        ReactionsModule reactionsModule = ReactionsModule(referenceModuleAddress);
        uint256 pubId = lensHub.getPubCount(profileId);
        uint256 nRef = reactionsModule.getNumberOfReferences(profileId, pubId);

        uint256 winningMemeRefAuthor = 0;
        uint256 winningMemeRefId = 0;
        uint256 maxLikes = 0;

        for (uint256 i = 0; i < nRef; i++) {
            (uint256 refAuthor, uint256 refId) = reactionsModule.getReferences(profileId, pubId, i);
            uint256 nLikes = reactionsModule.getNumberOfReactions(refAuthor, refId, '\\like');

            // In a tide, first meme wins
            if (nLikes > maxLikes) {
                maxLikes = nLikes;
                winningMemeRefAuthor = refAuthor;
                winningMemeRefId = refId;
            }
        }

        chosenMemeURI = lensHub.getContentURI(winningMemeRefAuthor, winningMemeRefId);
    }

    function _postMeme() private onlyOnceCreated {
        lensHub.post(
            DataTypes.PostData(
                profileId,
                chosenMemeURI,
                auctionCollectModuleAddress, // auctionCollectModule, TODO
                '', // collectModuleData,
                referenceModuleAddress,
                '' // referenceModuleData,
            )
        );
        lastPostTime = block.timestamp;
    }

    function _postPrivateMemeRequest() private onlyOnceCreated {
        lensHub.post(
            DataTypes.PostData(
                profileId,
                memeRequestPostURI,
                emptyCollectModuleAddress, // emptyCollectModule, TODO
                '', // collectModuleData,
                referenceModuleAddress,
                '' // referenceModuleData,
            )
        );
    }

    function setMemeRequestPostURI(string memory _newURI) public onlyOwner {
        memeRequestPostURI = _newURI;
    }

    // Chainlink Upkeep
    function checkUpkeep(bytes calldata checkData) public view returns (bool, bytes memory) {
        return (block.timestamp - lastPostTime > postCooldown, bytes(''));
    }

    function performUpkeep(bytes calldata performData) external {
        require(
            block.timestamp - lastPostTime > postCooldown,
            'Wait until the post cooldown is reached'
        );
        _setMeme();
        _postMeme();
        _postPrivateMemeRequest();
    }

    // Setting addresses for modules
    function setAuctionCollectModuleAddress(address _newAddress) public onlyOwner {
        auctionCollectModuleAddress = _newAddress;
    }

    function setEmptyCollectModuleAddress(address _newAddress) public onlyOwner {
        emptyCollectModuleAddress = _newAddress;
    }

    function setFollowModuleAddress(address _newAddress) public onlyOwner {
        followModuleAddress = _newAddress;
    }

    function setReferenceModuleAddress(address _newAddress) public onlyOwner {
        referenceModuleAddress = _newAddress;
    }
}
