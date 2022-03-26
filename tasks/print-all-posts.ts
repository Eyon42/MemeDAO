import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, AuctionCollectModule__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';

task('print-all-posts', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const auction = AuctionCollectModule__factory.connect(addrs["AuctionModule"], user)

    const profileId = await profileHolder.profileId();
    const pubCount = await lensHub.getPubCount(profileId);

    for (let i = 1; i <= pubCount.toNumber(); i++) {
        console.log(`Post: ${i}`)
        console.log(await lensHub.getPub(profileId, i))
        const isAuctionActive = await auction.getPublicationData(profileId, i)
        console.log(`Auction state: ${isAuctionActive}\n`)
    }
    // const accounts = await hre.ethers.getSigners()
    // console.log(`Owner of ${profileId}: ${await lensHub.ownerOf(profileId)}. Should be ${profileHolder.address}`)
});