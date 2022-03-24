import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory } from '../typechain-types';
import { initEnv, getAddrs } from './helpers/utils';


task('mock-chainlink-keeper', 'Call periodic functions on ').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    const upkeepNeeded = await profileHolder.checkUpkeep([]);
    if (upkeepNeeded) {
        await profileHolder.performUpkeep([]);
    }

    const pr_id = await profileHolder.profileId();
    const p_count = await lensHub.getPubCount(pr_id);

    console.log("\nWinning meme:\n");

    console.log(await lensHub.getPub(pr_id, p_count.toNumber() - 1)); // The last one is the request for new memes
});
