// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

import {ICollectModule} from '../../../interfaces/ICollectModule.sol';
import {Errors} from '../../../libraries/Errors.sol';
import {FeeModuleBase} from '../FeeModuleBase.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {FollowValidationModuleBase} from '../FollowValidationModuleBase.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {LensHub} from '../../LensHub.sol';

/**
 * @notice A struct containing the necessary data to execute collect actions on a publication.
 *
 * @param amount The collecting cost associated with this publication.
 * @param recipient The recipient address associated with this publication.
 * @param currency The currency associated with this publication.
 * @param referralFee The referral fee associated with this publication.
 */
struct AuctionProfilePublicationData {
    address recipient;
    address auctioneer;
    address currency;
    bool active;
}

/**
 * @title FeeCollectModule
 * @author Lens Protocol
 *
 * @notice This is a simple Lens CollectModule implementation, inheriting from the ICollectModule interface and
 * the FeeCollectModuleBase abstract contract.
 *
 * This module works by allowing unlimited collects for a publication at a given price.
 */
contract AuctionCollectModule is ICollectModule, FeeModuleBase, FollowValidationModuleBase {
    using SafeERC20 for IERC20;

    struct Bid {
        address bidder;
        uint256 bid;
    }

    mapping(uint256 => mapping(uint256 => Bid[])) _basePubToBids; // The bidders will remain forever in this smart contract's storage. It's cheaper than trying to delete them.
    //mapping(uint256 => mapping(uint256 => bool)) _isAuctionActive;

    mapping(uint256 => mapping(uint256 => AuctionProfilePublicationData))
        internal _dataByPublicationByProfile;

    constructor(address hub, address moduleGlobals) FeeModuleBase(moduleGlobals) ModuleBase(hub) {}

    /**
     * @notice This collect module creates an auction for collecting a publication.
     *
     * @param profileId The token ID of the profile of the publisher, passed by the hub.
     * @param pubId The publication ID of the newly created publication, passed by the hub.
     * @param data The arbitrary data parameter, decoded into:
     *      address currency: The currency address, must be internally whitelisted.
     *      address recipient: The custom recipient address to direct earnings to.
     *      address auctioneer: The address for the auctioneer.
     *
     * @return An abi encoded bytes parameter, which is the same as the passed data parameter.
     */
    function initializePublicationCollectModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        (address currency, address recipient, address auctioneer) = abi.decode(
            data,
            (address, address, address)
        );
        if (!_currencyWhitelisted(currency) || recipient == address(0))
            revert Errors.InitParamsInvalid();

        _dataByPublicationByProfile[profileId][pubId].recipient = recipient;
        _dataByPublicationByProfile[profileId][pubId].auctioneer = auctioneer;
        _dataByPublicationByProfile[profileId][pubId].currency = currency;
        _dataByPublicationByProfile[profileId][pubId].active = true;

        return data;
    }

    /**
     * @dev Processes a collect by:
     *  1. Ensuring the collector is the winner of the auction
     *  2. They pay
     *  3. Ensuring they have allowed transfer of the bid ammount
     *  4. Recording the valid bid for the future.
     */
    function processCollect(
        uint256 referrerProfileId,
        address collector,
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external virtual override onlyHub {
        require(referrerProfileId == profileId, 'Only the original publication can be collected');
        require(isAuctionActive(profileId, pubId) == false, 'This auction is still active');
        (address winner, ) = getWinningBid(profileId, pubId);
        require(winner == collector);
    }

    /**
     * @dev Register a bet by:
     *  1. Ensuring the collector is a follower
     *  2. Ensuring the auction is still open
     *  3. Ensuring they have allowed transfer of the bid ammount
     *  4. Recording the valid bid for the future.
     */
    function placeBid(
        uint256 profileId,
        uint256 pubId,
        uint256 bidAmount
    ) external {
        address collector = msg.sender;
        require(isAuctionActive(profileId, pubId), 'This auction is no longer active');
        _checkFollowValidity(profileId, collector);

        address currency = _dataByPublicationByProfile[profileId][pubId].currency;

        // See it they're bluffing
        require(IERC20(currency).allowance(collector, address(this)) >= bidAmount);
        require(IERC20(currency).balanceOf(collector) >= bidAmount);

        Bid memory bid = Bid(collector, bidAmount);
        _basePubToBids[profileId][pubId].push(bid);
    }

    /**
     * @notice Returns the publication data for a given publication, or an empty struct if that publication was not
     * initialized with this module.
     *
     * @param profileId The token ID of the profile mapped to the publication to query.
     * @param pubId The publication ID of the publication to query.
     *
     * @return The ProfilePublicationData struct mapped to that publication.
     */
    function getPublicationData(uint256 profileId, uint256 pubId)
        external
        view
        returns (AuctionProfilePublicationData memory)
    {
        return _dataByPublicationByProfile[profileId][pubId];
    }

    function getBids(
        uint256 profileId,
        uint256 pubId,
        uint256 i
    ) public view returns (address, uint256) {
        Bid storage bid = _basePubToBids[profileId][pubId][i];
        return (bid.bidder, bid.bid);
    }

    function getNumberOfBids(uint256 profileId, uint256 pubId) public view returns (uint256) {
        return _basePubToBids[profileId][pubId].length;
    }

    /**
     * @notice Return the current highest bid for a given publication (active or not).
     *
     * @param profileId The token ID of the profile mapped to the publication to query.
     * @param pubId The publication ID of the publication to query.
     *
     * @return The current winner's address and his bid.
     */
    function getWinningBid(uint256 profileId, uint256 pubId)
        public
        view
        returns (address, uint256)
    {
        Bid[] storage bids = _basePubToBids[profileId][pubId];
        address currency = _dataByPublicationByProfile[profileId][pubId].currency;

        address winner;
        uint256 winningAmount;

        for (uint256 i; i < bids.length; i++) {
            if (bids[i].bid > winningAmount) {
                if (
                    // Check that they haven't withdrawn the allowance or spent the funds
                    IERC20(currency).allowance(bids[i].bidder, address(this)) >= bids[i].bid &&
                    IERC20(currency).balanceOf(bids[i].bidder) >= bids[i].bid
                ) {
                    winner = bids[i].bidder;
                    winningAmount = bids[i].bid;
                }
            }
        }

        return (winner, winningAmount);
    }

    function isAuctionActive(uint256 profileId, uint256 pubId) public view returns (bool) {
        return _dataByPublicationByProfile[profileId][pubId].active;
    }

    /**
     * @notice Close the auction, determinate the winner and transfer the amount.
     *
     * @param profileId The token ID of the profile mapped to the publication with the auction to close.
     * @param pubId The publication ID of the publication with the auction to close.
     */
    function closeAuction(uint256 profileId, uint256 pubId) external {
        require(msg.sender == _dataByPublicationByProfile[profileId][pubId].auctioneer); // Only the auctioneer
        require(isAuctionActive(profileId, pubId) == true, 'This auction is no longer active');

        address currency = _dataByPublicationByProfile[profileId][pubId].currency;
        (address treasury, uint16 treasuryFee) = _treasuryData();
        address recipient = _dataByPublicationByProfile[profileId][pubId].recipient;

        (address winner, uint256 winningAmount) = getWinningBid(profileId, pubId);

        if (winner != address(0)) {
            uint256 treasuryAmount = (winningAmount * treasuryFee) / BPS_MAX;
            uint256 adjustedAmount = winningAmount - treasuryAmount;

            // I have no idea why this reverts. I already checked in the same transaction that the people have an allowance
            // For historic purposes: I figured it out. I was approving the receiver, not the transaction sender.
            // Had to look a the ERC20 source code to figure it out, took me about 2 days.
            IERC20(currency).safeTransferFrom(winner, recipient, adjustedAmount);
            IERC20(currency).safeTransferFrom(winner, treasury, treasuryAmount);
        }
        _dataByPublicationByProfile[profileId][pubId].active = false;
    }
}
