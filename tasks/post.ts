import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { PostDataStruct } from '../typechain-types/LensHub';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';

// create posts
task('post', 'publishes a post')
    .setAction(async ({ }, hre) => {
        const [governance, , user] = await initEnv(hre);
        const addrs = getAddrs();
        const emptyCollectModuleAddr = addrs['empty collect module'];
        const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

        await waitForTx(lensHub.whitelistCollectModule(emptyCollectModuleAddr, true));

        const inputStruct: PostDataStruct = {
            profileId: 1,
            contentURI:
                'https://ipfs.fleek.co/ipfs/plantghostplantghostplantghostplantghostplantghostplantghos',
            collectModule: emptyCollectModuleAddr,
            collectModuleData: [],
            referenceModule: ZERO_ADDRESS,
            referenceModuleData: [],
        };

        //  get all post's inputs
        await waitForTx(lensHub.connect(user).post(inputStruct));
        // createe a function & call it... From line 17 - 28

        console.log(await lensHub.getPub(1, 1));
    });

