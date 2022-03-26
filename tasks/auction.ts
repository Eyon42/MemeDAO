import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, Currency__factory, AuctionCollectModule__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('auction', 'Simulate the auction').setAction(async ({ }, hre) => {
    const [governance, treasury, user] = await initEnv(hre);
    const addrs = getAddrs();
    const accounts = await hre.ethers.getSigners()

    const abi = new hre.ethers.utils.AbiCoder()

    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const auction = AuctionCollectModule__factory.connect(addrs["AuctionModule"], user)
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const currency = Currency__factory.connect(addrs["currency"], user)



    const profileId = await profileHolder.profileId();
    const pubId = (await lensHub.getPubCount(profileId)).toNumber() - 1;

    const isAuctionActive = await auction.isAuctionActive(profileId, pubId)
    console.log(`Auction state: ${isAuctionActive}`)

    const bidder1 = accounts[4]; // "zer0dot"
    const bidder2 = accounts[5]; // "kek"

    try {
        await auction.connect(bidder1).placeBid(profileId, pubId, BigInt(10 * 10 ** 18))
    } catch {
        console.log("Bidding without approving currency fails. OK")
    }

    await Promise.all([
        lensHub.connect(bidder1).follow([profileId], [[]]),
        lensHub.connect(bidder2).follow([profileId], [[]])
    ])

    await Promise.all([
        currency.connect(bidder1).approve(auction.address, BigInt(1000 * 10 ** 18)),
        // currency.connect(bidder1).approve(treasury.address, BigInt(100 * 10 ** 18)),
        currency.connect(bidder2).approve(auction.address, BigInt(1000 * 10 ** 18)),
        // currency.connect(bidder2).approve(treasury.address, BigInt(1000 * 10 ** 18))
    ])

    console.log("Payments from bidders approved")

    await Promise.all([
        auction.connect(bidder1).placeBid(profileId, pubId, BigInt(5 * 10 ** 18)),
        auction.connect(bidder2).placeBid(profileId, pubId, BigInt(8 * 10 ** 18))
    ])

    console.log("Bids Placed")
});
