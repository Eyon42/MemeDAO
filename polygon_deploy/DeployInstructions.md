To deploy to the Polygon Mumbai testnet this are the steps to follow.

1. Compile everything with `$ npm hardhat compile`.
2. Copy the `polygon_deploy/addresses.json` file to the root of the project, overwriting the current file.
3. Add Polygon Mumbai Testnet to hardhat.
4. Run `$ npx hardhat deploy-modules --network mumbai` to deploy modules.
5. Get those modules whitelisted.
6. Change `_postCooldown` in `tasks/deploy-profile-holder` on the contract deployment call to be 1 day (in seconds).
7. Finally, run `$npx hardhat deploy-profile-holder --network mumbai`
   
With all of that done, the MemeDao is set up to run in the Polygon Mumbai Testnet and can be interacted either via smart contracts (like we do in the tasks folder of this repo) or via our Frontend app.
