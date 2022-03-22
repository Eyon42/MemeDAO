import { LensHub__factory, TwoWayReferenceModule__factory, ReactionsModule__factory } from '../../typechain-types';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './utils';
import fs from 'fs';


export async function deployAndAproveModule(moduleFactory, deployer, hre, moduleName) {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const Module = await deployContract(
        new moduleFactory(deployer).deploy(addrs['lensHub proxy'])
    );

    await waitForTx(lensHub.whitelistReferenceModule(Module.address, true));

    addrs[moduleName] = Module.address;
    const json = JSON.stringify(addrs, null, 2);
    fs.writeFileSync('addresses.json', json, 'utf-8');
}