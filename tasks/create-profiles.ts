import { task } from 'hardhat/config';
import { LensHub__factory, Currency__factory } from '../typechain-types';
import { CreateProfileDataStruct } from '../typechain-types/LensHub';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';

// add imguri use this to create profile
async function create_profile(lensHub, user, handle) {
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));

    // Give 'em muny
    const addrs = getAddrs();
    const currency = Currency__factory.connect(addrs["currency"], user)
    currency.mint(user.address, BigInt(1000 * 10 ** 18))

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
    console.log(
        `Created profile. Id: ${await lensHub.getProfileIdByHandle(
            handle
        )}, handle: ${handle}`
    );
}

task('create-profiles', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const accounts = await hre.ethers.getSigners()
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await Promise.all([
        create_profile(lensHub, accounts[4], "zer0dot"),
        create_profile(lensHub, accounts[5], "kek")
        //  add more accounts create accounts with profile pictures run all start or u can do one task at the tile npx hardhat taskname = create-profiles is name of the task  it has to be a different name for everytime I can

        // after creating profiles call task start.sh  we need the  handles to be ready at the begging to get it on my front =>
        // lens protocol documentation call the read function they will return data for all profile, allMemes, sc call => lenshub.method(args)
    ])

    console.log(`Profiles created. Total supply: ${await lensHub.totalSupply()}`);
});
