import { task } from 'hardhat/config';
import { LensHub__factory, ProfileHolder__factory } from '../typechain-types';
import { CreateProfileDataStruct } from '../typechain-types/LensHub';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';
import fs from 'fs';

task('deploy-profile-holder', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    const n = await lensHub.totalSupply()
    const handle = `memedaov${n}`

    const profileHolder = await deployContract(
        new ProfileHolder__factory(user).deploy(addrs['lensHub proxy'],
            addrs['empty collect module'], addrs['empty collect module'], addrs["ReactionsModule"],
            ZERO_ADDRESS, 0, handle)
    );

    await waitForTx(lensHub.whitelistProfileCreator(profileHolder.address, true));

    await profileHolder.createProfile();
    const pr_id = await profileHolder.profile_id();


    console.log(`Total supply : ${await lensHub.totalSupply()}`);
    console.log(
        `Profile owner: ${await lensHub.ownerOf(pr_id)},
        user address (should not be the same): ${user.address}`
    );
    console.log(
        `Profile ID by handle: ${await lensHub.getProfileIdByHandle(
            handle
        )}`
    );

    addrs["ProfileHolder"] = profileHolder.address;
    const json = JSON.stringify(addrs, null, 2);
    fs.writeFileSync('addresses.json', json, 'utf-8');

});