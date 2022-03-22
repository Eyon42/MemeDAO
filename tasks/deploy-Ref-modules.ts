import { task } from 'hardhat/config';
import { LensHub__factory, TwoWayReferenceModule__factory, ReactionsModule__factory } from '../typechain-types';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';
import { deployAndAproveModule } from './helpers/postDeployUtils'



task('deploy-Ref-modules', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();

    await deployAndAproveModule(TwoWayReferenceModule__factory, user, hre, "TwoWayReferenceModule");
    await deployAndAproveModule(ReactionsModule__factory, user, hre, "ReactionsModule");

});