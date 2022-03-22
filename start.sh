#!/bin/bash

npm run full-deploy-local
npx hardhat unpause --network localhost

npx hardhat deploy-BackRef-module --network localhost

npx hardhat deploy-profile-holder --network localhost

npx hardhat ph-post --network localhost

npx hardhat ph-post --network localhost

npx hardhat create-profiles --network localhost
npx hardhat like --network localhost
npx hardhat like --network localhost

npx hardhat getRefs --network localhost
