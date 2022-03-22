import { task } from 'hardhat/config';
import { LensHub__factory, TwoWayReferenceModule__factory, ProfileHolder__factory } from '../typechain-types';
import { CommentDataStruct } from '../typechain-types/LensHub';
import { initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';


task('getRefs', 'Get all references for a pub').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const emptyCollectModuleAddr = addrs['empty collect module'];
    const accounts = await hre.ethers.getSigners();
    const liker = accounts[4];

    const twrModule = TwoWayReferenceModule__factory.connect(addrs["TwoWayReferenceModule"], user);
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], liker);

    const pr_id = (await profileHolder.profile_id()).toNumber();
    const p_count = (await lensHub.getPubCount(pr_id)).toNumber();
    console.log(`OP: ${pr_id}, ${p_count}`)

    const nRef = (await twrModule.getNumberOfReferences(pr_id, p_count)).toNumber();
    console.log(`References: ${nRef}`)

    for (let i = 0; i < nRef; i++) {
        const [refAuthor, refId] = await twrModule.getReferences(pr_id, p_count, i);
        console.log(`Ref: ${refAuthor}, ${refId}`)
        try {
            console.log(await lensHub.getContentURI(refAuthor, refId.toNumber()));
        }
        catch {
            console.log("Publication does not exists")
        }
    }
});