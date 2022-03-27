import { task } from 'hardhat/config';
import { boolean } from 'hardhat/internal/core/params/argumentTypes';
import { LensHub__factory, ProfileHolder__factory, Currency__factory, TwoTierFollowModule__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('member', 'Simulate the auction').setAction(async ({ }, hre) => {
    const [governance, treasury, user] = await initEnv(hre);
    const addrs = getAddrs();
    const accounts = await hre.ethers.getSigners()

    const abi = new hre.ethers.utils.AbiCoder()

    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const currency = Currency__factory.connect(addrs["currency"], user)
    const ttfModule = TwoTierFollowModule__factory.connect(addrs["TwoTierFollowModule"], user)

    const profileId = await profileHolder.profileId();
    const pubId = (await lensHub.getPubCount(profileId)).toNumber() - 1;


    const bidder1 = accounts[4]; // "zer0dot"
    const bidder2 = accounts[5]; // "kek"
    const bidder1Id = await lensHub.getProfileIdByHandle("zer0dot")
    const bidder2Id = await lensHub.getProfileIdByHandle("kek")

    await Promise.all([
        currency.connect(bidder1).approve(ttfModule.address, BigInt(1000 * 10 ** 18)),
        currency.connect(bidder2).approve(ttfModule.address, BigInt(1000 * 10 ** 18))
    ])

    await Promise.all([
        lensHub.connect(bidder1).follow([profileId], [abi.encode(["bool", "uint256"], [true, bidder1Id])]),
        lensHub.connect(bidder2).follow([profileId], [abi.encode(["bool", "uint256"], [true, bidder2Id])])
    ])
});
