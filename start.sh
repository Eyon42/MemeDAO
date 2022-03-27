#!/bin/bash

set -e

npm run compile

npm run full-deploy-local
npx hardhat unpause --network localhost
npx hardhat create-profiles --network localhost

./deployDAO.sh