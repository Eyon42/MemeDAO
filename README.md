# MemeDAO

[Work-in-progress]

Project for EthGlobal LFGrow Hackathon.

## Instructions: 
### Basic setup:

Run the hardhat local network

```$ npx hardhat node```

### Run everything
For the first run, you have to deploy the lens protocol.
The script [start.sh](https://github.com/Eyon42/MemeDAO/blob/main/start.sh) will deploy the protocol along with the MemeDao and run all steps.

```$ ./start.sh```

### Deploy and run
If you want to re-deploy only the DAO's smart contract you can run the [deployDAO.sh](https://github.com/Eyon42/MemeDAO/blob/main/deployDAO.sh) script:

```$ ./deployDAO.sh```

### Running only specific tasks
You can peek into the previous two bash scripts and copy and paste each command.

## Work Done:

### [Profile Holder Smart contract](https://github.com/Eyon42/MemeDAO/blob/main/contracts/ProfileHolder.sol)
We made a smart contract that creates and holds a profile. The profile specialized in one thing. Posting a meme request at the beggining of the day, and at the end of the day chose the commented meme with more "likes", then post it and make it available to collect via a 24 hour auction.

The whole mechanism of the DAO runs on a 24 hour cycle (can be changed) relying on chainlink keeper for the function calls.

### Modules:

#### [TwoWayReferenceModule](https://github.com/Eyon42/MemeDAO/blob/main/contracts/core/modules/reference/TwoWayReferenceModule.sol)
The Lens Protocol doesn't have a way to natively get all of the publication that reference a given publication. We implemented this module (and made it easy to incorporate into other modules) for that exact reason. 

#### [ReactionsModule](https://github.com/Eyon42/MemeDAO/blob/main/contracts/core/modules/reference/ReactionsModule.sol)
Based on TwoWayReferenceModule, it adds a function to count comments with a determinated contentURI. This way we can set up a standard for our app where, for example, if the comment has `contentURI="\like"` then that's counted as a like.
As this module only adds view functionallity, we also made it available as a [library](https://github.com/Eyon42/MemeDAO/blob/main/contracts/libraries/Reactions.sol) to extend reading a current TwoWayReferenceModule

#### [AuctionCollectModule](https://github.com/Eyon42/MemeDAO/blob/main/contracts/core/modules/collect/AuctionCollectModule.sol)
Allows people to post bids to an auction (they have to approve the module as spender for the bidded amount). Then when the auction is closed, the highest bidder is charged (if someones withdraws their allowance before closing they are no longer eligible) and is then able to collect their nft. Mirrors can't be collected (users can still bid, but the frontend shouldn't give them the option).

#### [TwoTierFollowModule](https://github.com/Eyon42/MemeDAO/blob/main/contracts/core/modules/follow/TwoTierFollowModule.sol)
Allows folowers to include a "member" flag in the call to follow. This charges them a fee and adds them to the module's storage as a member of the profile. A whitelist could be implemented.

### Deployment to Polygon Mumbai Testnet
As we thought the modules still need some work to get whitelisted on the testnet, we haven't deployed yet. But for when the time to deploy comes, we already have all scripts prepared and a very simple [instructions manual](https://github.com/Eyon42/MemeDAO/blob/main/polygon_deploy/DeployInstructions.md) to deploy everyting in a couple of minutes (minus time expecting for module whitelisting).

## Notes:

### TO-DOs
- Add one comment per person mechanism
- Review how the FollowerTier relationship is stored. Current approach is most likely flawed. Should include the FollowNFT.
- Replace some contracts with interfaces on imports
- Add check for memebership while commenting request-post.
- Create mechanism for composing modules
- Implement onlyMemeber modifier for ProfileHolder.
- Add option to set membership cost in ProfileHolder
- Proxy the ProfileHolder
- Descentralize owner role (Maybe just deploy the contract with a gnosis safe address)
- Automate deployment (It's too manual and error prone)

### To-Learn
This is a list of thing that we learned that we need to learn or get better at:
- How to use docker. We ended up just yeeting it, after wastign some time with it.
- How to properly set up the IDE for Solidity coding. For some reason it only caugths basic syntax error but not type errors or undefined variables or anything more subtle so we wasted a lot of time compiling to see errors. I write this, next day hardhat releases the new version of the VS Code Solidity extension which solves a lot of troubles... Timing.
- How to properly set up the IDE for Javascript. We had some clashes in the linting for Typescript and React.
- How to test in hardhat. Tried it quickly, gave up, continued writing everything as tasks
- More advanced Solidity debugging. I wasn't able to see raised events with hardhat, so I was blind most of the time. Also, a traditional debugger would be awesome.
- Setting up debugging for hardhat. Tests also gave me some pain
- Get used to typescript. It's a bit more effort figuring out what type is everything, but it caughts errors without waiting for all of the code to run.
  
### What we did learn
#### Francesco (Eyon42):
Uff this is a lot. This is my first time writing smart contracts that aren't just tokens based off a template with a few playfull functionalities. I learned to use hardhat, work around typescript(I'll sit down with it after the hackathon), to use the lens protocol which I see very interesting for many of my future projects and that I shouldn't shy away from participating on hackathons.

