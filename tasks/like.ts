import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory, ReactionsModule__factory } from '../typechain-types';
import { CommentDataStruct } from '../typechain-types/LensHub';
import { initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';

async function likePost(likerId, authorId, postId, user) {
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user);
    const emptyCollectModuleAddr = addrs['empty collect module'];
    console.log("author, post")
    console.log(authorId.toNumber(), postId.toNumber())
    console.log(await lensHub.getContentURI(authorId, postId))
    const like: CommentDataStruct = {
        profileId: likerId,
        contentURI: "reactions://like",
        profileIdPointed: authorId,
        pubIdPointed: postId,
        collectModule: emptyCollectModuleAddr,
        collectModuleData: [],
        referenceModule: ZERO_ADDRESS,
        referenceModuleData: [],
    }
    await lensHub.comment(like);
}

task('like', 'creates a profile').setAction(async ({ }, hre) => {
    const [, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const accounts = await hre.ethers.getSigners();
    const liker = accounts[4];

    const reactionsModule = ReactionsModule__factory.connect(addrs["ReactionsModule"], user);
    const profileHolder = ProfileHolder__factory.connect(addrs['ProfileHolder'], user);
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], liker);


    // Get the post
    const authorId = await profileHolder.profileId();
    const postId = await lensHub.getPubCount(authorId);

    // Get the post's comments
    const nRef = (await reactionsModule.getNumberOfReferences(authorId, postId)).toNumber();

    const authorToMeme = {};

    for (let i = 0; i < nRef; i++) {
        const [refAuthor, refId] = await reactionsModule.getReferences(authorId, postId, i);
        authorToMeme[refAuthor.toNumber()] = refId;
    }

    const liker1Id = await lensHub.getProfileIdByHandle("zer0dot");
    const liker2Id = await lensHub.getProfileIdByHandle("kek");

    // Have them vote themselves

    await Promise.all([
        likePost(liker1Id, liker1Id, authorToMeme[liker1Id.toNumber()], accounts[4]),
        likePost(liker1Id, liker2Id, authorToMeme[liker2Id.toNumber()], accounts[4]), // Here one's cheating, we'll add a third voter later and a voting restriction later TODO
        likePost(liker2Id, liker2Id, authorToMeme[liker2Id.toNumber()], accounts[5])
    ])

    console.log("Meme votes casted")
    console.log(await lensHub.getContentURI(liker1Id, authorToMeme[liker1Id.toNumber()]))
    console.log((await reactionsModule.getNumberOfReactions(liker1Id, authorToMeme[liker1Id.toNumber()], 'reactions://like')).toNumber())
    console.log(await lensHub.getContentURI(liker2Id, authorToMeme[liker2Id.toNumber()]))
    console.log((await reactionsModule.getNumberOfReactions(liker2Id, authorToMeme[liker2Id.toNumber()], 'reactions://like')).toNumber())
});
