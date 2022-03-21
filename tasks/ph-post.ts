import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory } from '../typechain-types';
import { CreateProfileDataStruct } from '../typechain-types/LensHub';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';


task('ph-post', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    const pr_id = await profileHolder.profile_id();

    await profileHolder.setMeme("https://www.google.com/search?q=meme");
    console.log("Set chosen meme")
    await profileHolder.postMeme();
    console.log("Posted chosen meme")

    const p_count = await lensHub.getPubCount(pr_id);
    console.log(p_count.toNumber())
    console.log(pr_id.toNumber())

    console.log(await lensHub.getPub(pr_id, p_count));
});