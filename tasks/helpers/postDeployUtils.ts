import { LensHub__factory, TwoWayReferenceModule__factory, ReactionsModule__factory } from '../../typechain-types';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './utils';
import fs from 'fs';


export async function deployAndAproveModule(moduleFactory, deployer, hre, moduleName, args, type) {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const Module = await deployContract(
        new moduleFactory(deployer).deploy(addrs['lensHub proxy'], ...args)
    );

    switch (type) {
        case "reference":
            await lensHub.whitelistReferenceModule(Module.address, true);
            console.log(`Whitelisted ${moduleName} reference module`)
            break;
        case "collect":
            await lensHub.whitelistCollectModule(Module.address, true);
            console.log(`Whitelisted ${moduleName} collect module`)
            break;
        case "follow":
            await lensHub.whitelistFollowModule(Module.address, true);
            console.log(`Whitelisted ${moduleName} follow module`)
            break;
        default:
            break;
    }


    addrs[moduleName] = Module.address;
    const json = JSON.stringify(addrs, null, 2);
    fs.writeFileSync('addresses.json', json, 'utf-8');
    console.log(`Saved ${moduleName} address`)
}