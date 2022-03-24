import { task } from 'hardhat/config';
import { LensHub__factory, TwoWayReferenceModule__factory, ReactionsModule__factory, AuctionCollectModule__factory } from '../typechain-types';
import { deployContract, waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';
import { deployAndAproveModule } from './helpers/postDeployUtils'



task('deploy-modules', 'creates a profile').setAction(async ({ }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await waitForTx(lensHub.whitelistCollectModule(addrs['empty collect module'], true));

    await deployAndAproveModule(TwoWayReferenceModule__factory, user, hre, "TwoWayReferenceModule", []);
    await deployAndAproveModule(ReactionsModule__factory, user, hre, "ReactionsModule", []);
    await deployAndAproveModule(AuctionCollectModule__factory, user, hre, "AuctionModule", [addrs["module globals"]]);

    console.log("Modules Deployed");

});