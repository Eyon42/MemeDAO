import { task } from 'hardhat/config';
import { LensHub__factory, TwoWayReferenceModule__factory } from '../typechain-types';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';
import fs from 'fs';

task('deploy-BackRef-module', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    const n = await lensHub.totalSupply()
    const handle = `memedaov${n}`

    const twoWayReferenceModule = await deployContract(
        new TwoWayReferenceModule__factory(user).deploy()
    );

    await waitForTx(lensHub.whitelistReferenceModule(twoWayReferenceModule.address, true));

    console.log(`TwoWayReferenceModule deployed and approved at ${twoWayReferenceModule.address}`)

    addrs["TwoWayReferenceModule"] = twoWayReferenceModule.address;
    const json = JSON.stringify(addrs, null, 2);
    fs.writeFileSync('addresses.json', json, 'utf-8');

});