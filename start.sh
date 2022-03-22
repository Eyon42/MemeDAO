#!/bin/bash

npx hardhat compile

npm run full-deploy-local
npx hardhat unpause --network localhost

./deployDAO.sh