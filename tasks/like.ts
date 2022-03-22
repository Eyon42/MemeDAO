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

    const pr_id = await profileHolder.profileId();
    const p_count = await lensHub.getPubCount(pr_id);
    console.log(pr_id.toNumber(), p_count.toNumber())
    //const pub = await lensHub.getPub(pr_id, p_count)

    const liker_id = await lensHub.getProfileIdByHandle("zer0dot");
    console.log(`liker id: ${liker_id.toNumber()}`)

    const like: CommentDataStruct = {
        profileId: liker_id,
        contentURI: "\like",
        profileIdPointed: pr_id,
        pubIdPointed: p_count,
        collectModule: emptyCollectModuleAddr,
        collectModuleData: [],
        referenceModule: ZERO_ADDRESS,
        referenceModuleData: [],
    }
    console.log("created post template")

    const tx = await lensHub.comment(like);
    console.log("posted")
    const receipt = await tx.wait();
    console.log(receipt.logs)


});