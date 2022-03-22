import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory } from '../typechain-types';
import { CommentDataStruct } from '../typechain-types/LensHub';
import { initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';


task('like', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const emptyCollectModuleAddr = addrs['empty collect module'];
    const accounts = await hre.ethers.getSigners();
    const liker = accounts[4];

    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], liker);

    const pr_id = await profileHolder.profile_id();
    const p_count = await lensHub.getPubCount(pr_id);
    const pub = await lensHub.getPub(pr_id, p_count)

    const like: CommentDataStruct = {
        profileId: await lensHub.defaultProfile(liker.address),
        contentURI: "\like",
        profileIdPointed: pr_id,
        pubIdPointed: p_count,
        collectModule: emptyCollectModuleAddr,
        collectModuleData: "",
        referenceModule: ZERO_ADDRESS,
        referenceModuleData: "",
    }

    lensHub.comment(like)



    console.log();
});