import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('auction', 'Simulate the auction').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);

    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    const authorId = await profileHolder.profileId();
    const postId = (await lensHub.getPubCount(authorId)).toNumber() - 1;

    const bidder1 = await lensHub.getProfileIdByHandle("zer0dot");
    const bidder2 = await lensHub.getProfileIdByHandle("kek");




});
