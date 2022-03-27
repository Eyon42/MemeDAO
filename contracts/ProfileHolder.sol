// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/TransparentUpgradeableProxy.sol)

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';
import {LensHub} from './core/LensHub.sol';
import {ReactionsModule} from './core/modules/reference/ReactionsModule.sol';
import {AuctionCollectModule} from './core/modules/collect/AuctionCollectModule.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract ProfileHolder {
    using SafeERC20 for IERC20;

    LensHub lensHub;
    address currency;
    address lensHubAddress;
    address auctionCollectModuleAddress;
    address emptyCollectModuleAddress;
    address referenceModuleAddress;
    address followModuleAddress;

    address owner;

    uint256 public profileId; //lens protocol does not mint NFTs with 0, it's used to signify an uninitialized variable.
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
        address _currency,
        address _auctionCollectModule,
        address _emptyCollectModule,
        address _referenceModule,
        address _followModule,
        uint256 _postCooldown,
        string memory _handle
    ) {
        owner = msg.sender;
        lensHubAddress = _LensHub;
        currency = _currency;
        auctionCollectModuleAddress = _auctionCollectModule;
        emptyCollectModuleAddress = _emptyCollectModule;
        referenceModuleAddress = _referenceModule;
        followModuleAddress = _followModule;
        lensHub = LensHub(lensHubAddress);
        handle = _handle;
        postCooldown = _postCooldown;
        lastPostTime = 0;
        profileId = 0;
    }

    function createProfile() public onlyOwner {
        require(profileId == 0, 'The profile has already been created');
        uint256 membershipFee = 1e18;
        lensHub.createProfile(
            DataTypes.CreateProfileData(
                address(this),
                handle,
                'https://static.wikia.nocookie.net/memes-pedia/images/d/df/Nada.png/revision/latest/scale-to-width-down/797?cb=20201119214705&path-prefix=es', // Not Ipfs :(
                followModuleAddress,
                abi.encode(membershipFee, currency, address(this)),
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
            uint256 nLikes = reactionsModule.getNumberOfReactions(
                refAuthor,
                refId,
                'reactions://like'
            );
            // In a tide, last meme wins (got more likes in less time)
            if (nLikes >= maxLikes) {
                maxLikes = nLikes;
                winningMemeRefAuthor = refAuthor;
                winningMemeRefId = refId;
            }
        }

        if (winningMemeRefAuthor == 0 || winningMemeRefId == 0) {
            chosenMemeURI = '';
        } else {
            chosenMemeURI = lensHub.getContentURI(winningMemeRefAuthor, winningMemeRefId);
        }
    }

    function _postMeme() private onlyOnceCreated {
        lensHub.post(
            DataTypes.PostData(
                profileId,
                chosenMemeURI,
                auctionCollectModuleAddress, // auctionCollectModule
                abi.encode(currency, address(this), address(this)), // currency, receiver, auctioneer
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
        // Close the previous post's auction
        uint256 pubId = lensHub.getPubCount(profileId) - 1;
        if (pubId != 0) {
            AuctionCollectModule(auctionCollectModuleAddress).closeAuction(profileId, pubId);
        }
        _setMeme();
        if (keccak256(abi.encode(chosenMemeURI)) != keccak256(abi.encode(''))) {
            _postMeme(); // We're not posting empty publications
        }
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

    // Managing balance and withdrawal
    function currencyBalance() public view returns (uint256) {
        return IERC20(currency).balanceOf(address(this));
    }

    function withdrawFunds() external onlyOwner {
        IERC20(currency).transfer(owner, currencyBalance());
    } // TODO
}
