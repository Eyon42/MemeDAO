# MemeDAO

[Work-in-progress]

Project for EthGlobal LFGrow Hackathon.

## Instructions: 
### Basic setup:
Follow [this](https://docs.lens.dev/docs/quick-setup) for setting up the working environment with docker.

```$ docker-compose up```
```$ docker-compose exec contracts-env bash```

Run the hardhat local network

```$ npx hardhat node```

### Run everything
For the first run, you have to deploy the lens protocol.
The script `start.sh` will deploy the protocol along with the MemeDao and run all steps.

```$ ./start.sh```

### Deploy and run
If you want to re-deploy only the DAO's smart contract you can run:

```$ ./deployDAO.sh```

### Running only specific tasks
You can peek into the previous two bash scripts and copy and paste each command.

## Work Done:

### Modules:

#### TwoWayReferenceModule
The Lens Protocol doesn't have a way to natively get all of the publication that reference a given publication. We implemented this module (and made it easy to incorporate into other modules) for that exact reason. 

#### ReactionsModule
Based on TwoWayReferenceModule, it adds a function to count comments with a determinated contentURI. This way we can set up a standard for our app where, for example, if the comment has `contentURI="\like"` then that's counted as a like.

#### AuctionCollectModule
Allows people to post bids to an auction (they have to approve the module as spender for the bidded amount). Then when the auction is closed, the highest bidder is charged (if someones withdraws their allowance before closing they are no longer eligible) and is then able to collect their nft. Mirrors can't be collected (users can still bid, but the frontend shouldn't give them the option).

#### TwoTierFollowModule
Allows folowers to include a "member" flag in the call to follow. This charges them a fee and adds them to the module's storage as a member of the profile. A whitelist could be implemented.


## Notes:
- The scripts can be found and edited under the `tasks` folder.
- If finding the previous comand prompt inside the docker bash is too annoying then run this to add color to the prompt:
```$ export PS1='\[\e[32m\u\] \[\e[36m\w\] \[\e[33m\]\[\e[1m\]$ \[\e[0m\]```

### TO-DOs
- Add one comment per person mechanism
- Review how the FollowerTier relationship is stored. Current approach is most likely flawed. Should include the FollowNFT.
- Replace some contracts with interfaces on imports
- Add check for memebership while commenting request-post.
- Create mechanism for composing modules
- Implement onlyMemeber modifier for ProfileHolder.
- Add option to set membership cost in ProfileHolder
- Proxy the ProfileHolder

### To-Learn
- How to use docker. We ended up just yeeting it, after wastign some time with it.
- How to properly set up the IDE for Solidity coding. For some reason it only caugths basic syntax error but not type errors or undefined variables or anything more subtle so we wasted a lot of time compiling to see errors. I write this, next day hardhat releases the new version of the VS Code Solidity extension which solves a lot of troubles... Timing.
- How to properly set up the IDE for Javascript. We had some clashes in the linting for Typescript and React.
- How to test in hardhat. Tried it quickly, gave up, continued writing everything as tasks
- More advanced Solidity debugging. I wasn't able to see raised events with hardhat, so I was blind most of the time. Also, a traditional debugger would be awesome.
- Setting up debugging for hardhat. Tests also gave me some pain
- Get used to typescript. It's a bit more effort figuring out what type is everything, but it caughts errors without waiting for all of the code to run.
- 