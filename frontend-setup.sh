#!/bin/bash
set -e

npx hardhat compile

npm run full-deploy-local
npx hardhat unpause --network localhost
npx hardhat create-profiles --network localhost

npx hardhat deploy-modules --network localhost

npx hardhat deploy-profile-holder --network localhost

#--show-stack-traces
