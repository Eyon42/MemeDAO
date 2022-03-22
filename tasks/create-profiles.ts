import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { CreateProfileDataStruct } from '../typechain-types/LensHub';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';

async function create_profile(lensHub, user, handle) {
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));

    const inputStruct: CreateProfileDataStruct = {
        to: user.address,
        handle: handle,
        imageURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleData: [],
        followNFTURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };

    await waitForTx(lensHub.connect(user).createProfile(inputStruct));
    console.log(`Total supply (should be 1): ${await lensHub.totalSupply()}`);
    console.log(
        `Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${user.address}`
    );
    console.log(
        `Profile ID by handle: ${await lensHub.getProfileIdByHandle(
            handle
        )}, user address (should be the same): ${user.address}`
    );
}

task('create-profiles', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const accounts = await hre.ethers.getSigners()
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await create_profile(lensHub, accounts[4], "zer0dot")
    await create_profile(lensHub, accounts[5], "kek")
});