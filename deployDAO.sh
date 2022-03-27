#!/bin/bash
# redeployes all the code, i can add  more fields on the task then I can add 

set -e

npx hardhat deploy-modules --network localhost

npx hardhat deploy-profile-holder --network localhost

npx hardhat post-memes --network localhost

npx hardhat like --network localhost

npx hardhat mock-chainlink-keeper --network localhost

# npx hardhat post-memes --network localhost

# npx hardhat like --network localhost

npx hardhat auction --network localhost

npx hardhat mock-chainlink-keeper --network localhost


#--show-stack-traces
