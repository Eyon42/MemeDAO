import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, AuctionCollectModule__factory, Currency__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('mock-chainlink-keeper', 'Call periodic functions on contract').setAction(async ({ }, hre) => {
    const [governance, treasury, user] = await initEnv(hre);
    const addrs = getAddrs();
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);

    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const auction = AuctionCollectModule__factory.connect(addrs["AuctionModule"], user)

    const profileId = await profileHolder.profileId();
    let pubId = (await lensHub.getPubCount(profileId)).toNumber() - 1;

    const currency = Currency__factory.connect(addrs["currency"], user)
    const accounts = await hre.ethers.getSigners()

    // For debugging
    if (pubId != 0) {
        console.log(await lensHub.getContentURI(profileId, pubId))
        const [auctionWinner, winningAmount] = await auction.getWinningBid(profileId, pubId)
        const bidder2 = accounts[5]
        const allowance = await currency.allowance(bidder2.address, profileHolder.address)
        const allowance2 = await currency.allowance(bidder2.address, profileHolder.address)
        const nBids = await auction.getNumberOfBids(profileId, pubId)
        console.log(`Number of bids: ${nBids}`)
        const bids = await Promise.all(
            [...Array(nBids).keys()].map((i) => (auction.getBids(profileId, pubId, i)))
        )
        console.log(`Bids: ${JSON.stringify(bids)}`)
        console.log(`Winner: ${auctionWinner}(should be ${bidder2.address}) with ${winningAmount}. Allowances: ${allowance} ${allowance2}`)
    }


    const upkeepNeeded = await profileHolder.checkUpkeep([]);
    if (upkeepNeeded) {
        await profileHolder.performUpkeep([]);
        // const tx = await profileHolder.performUpkeep([]);
        // const txR = await tx.wait()
        // console.log(txR.events?.map((i) => {
        //     return {
        //         from: i?.args?.from?.toString(),
        //         to: i?.args?.to?.toString(),
        //         amount: i?.args?.amount?.toString()
        //     }
        // }))
    }

    const pr_id = await profileHolder.profileId();
    const p_count = await lensHub.getPubCount(pr_id);

    console.log("\nWinning meme:\n");

    console.log(await lensHub.getPub(pr_id, p_count.toNumber() - 1)); // The last one is the request for new memes

    // Results from previous auction
    pubId = (await lensHub.getPubCount(profileId)).toNumber();
    if (pubId > 3) {
        const [winner, amount] = await auction.getWinningBid(profileId, pubId - 3)
        console.log(`The winner for the auction is ${winner}, with ${BigInt(amount.toString()) / BigInt(10 ** 18)} units of currency`)
    }
});
