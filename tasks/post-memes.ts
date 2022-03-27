import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, ReactionsModule__factory } from '../typechain-types';
import { CommentDataStruct } from '../typechain-types/LensHub';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';

// post memes as comments 
task('post-memes', 'Posts memes')
    .setAction(async ({ }, hre) => {
        const [governance, , user] = await initEnv(hre);
        const accounts = await hre.ethers.getSigners()
        const addrs = getAddrs();
        const reactionsModuleModuleAddr = addrs['ReactionsModule'];
        const reactionsModule = ReactionsModule__factory.connect(addrs["ReactionsModule"], user);
        const emptyCollectModuleAddr = addrs['empty collect module'];
        const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
        const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);

        const authorId = await profileHolder.profileId();
        const postId = await lensHub.getPubCount(authorId);

        const memer1Id = await lensHub.getProfileIdByHandle("zer0dot")
        const meme1: CommentDataStruct = {
            profileId: memer1Id,
            contentURI:
                'meme from zer0dot',
            profileIdPointed: authorId,
            pubIdPointed: postId,
            collectModule: emptyCollectModuleAddr,
            collectModuleData: [],
            referenceModule: reactionsModuleModuleAddr,
            referenceModuleData: [],
        };

        const memer2Id = await lensHub.getProfileIdByHandle("kek")
        const meme2: CommentDataStruct = {
            profileId: memer2Id,
            contentURI:
                'meme from kek',
            profileIdPointed: authorId,
            pubIdPointed: postId,
            collectModule: emptyCollectModuleAddr,
            collectModuleData: [],
            referenceModule: reactionsModuleModuleAddr,
            referenceModuleData: [],
        };

        await Promise.all([
            waitForTx(lensHub.connect(accounts[4]).comment(meme1)),
            waitForTx(lensHub.connect(accounts[5]).comment(meme2))
        ])

        console.log(`${await reactionsModule.getNumberOfReferences(authorId, postId)} memes posted`);
    });

