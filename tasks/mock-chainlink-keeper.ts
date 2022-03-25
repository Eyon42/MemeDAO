import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, AuctionCollectModule__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('mock-chainlink-keeper', 'Call periodic functions on contract').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);

    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const auction = AuctionCollectModule__factory.connect(addrs["AuctionModule"], user)

    const profileId = await profileHolder.profileId();
    let pubId = (await lensHub.getPubCount(profileId)).toNumber();
    const isAuctionActive = await auction.isAuctionActive(profileId, pubId)
    console.log(`Auction state: ${isAuctionActive}`)

    const upkeepNeeded = await profileHolder.checkUpkeep([]);
    if (upkeepNeeded) {
        await profileHolder.performUpkeep([]);
    }

    const pr_id = await profileHolder.profileId();
    const p_count = await lensHub.getPubCount(pr_id);

    console.log("\nWinning meme:\n");

    console.log(await lensHub.getPub(pr_id, p_count.toNumber() - 1)); // The last one is the request for new memes

    // Results from previous auction
    pubId = (await lensHub.getPubCount(profileId)).toNumber();
    if (pubId > 3) {
        const [winner, amount] = await auction.getWinningBid(profileId, pubId - 1)
        console.log(`The winner for the auction is ${winner}, with ${amount.toNumber() / (10 ** 18)} units of currency`)
    }
});
