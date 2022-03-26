# MemeDAO

[Work-in-progress]

Project for EthGlobal LFGrow Hackathon.

## Instructions: 
### Basic setup:
Follow [this](https://docs.lens.dev/docs/quick-setup) for setting up the working environment with docker.

```$ docker-compose up```
```$ docker-compose exec contracts-env bash```

Once inside the container, compile with:

```$ npx hardhat compile```

Run the hardhat local network

```$ npx hardhat node```

Deploy the lens protocol

```$ npm run full-deploy-local```

Finally, unpause it:

```$ npx hardhat unpause --network localhost```

## Deploy and run
Once everything is running we can deploy the profile holder smart contract:

```$ npx hardhat deploy-profile-holder --network localhost```

This gives us the base contract and creates a profile controlled by it.

We can then give the contract a content URI and set it to post the content with:

```$ npx hardhat ph-post --network localhost```

## Work Done:

### Modules:

#### TwoWayReferenceModule
The Lens Protocol doesn't have a way to natively get all of the publication that reference a given publication. We implemented this module (and made it easy to incorporate into other modules) for that exact reason. 

#### ReactionsModule
Based on TwoWayReferenceModule, it adds a function to count comments with a determinated contentURI. This way we can set up a standard for our app where, for example, if the comment has `contentURI="\like"` then that's counted as a like.

## Notes:
- The scripts can be found and edited under the `tasks` folder.
- If finding the previous comand prompt inside the docker bash is too anoying then run this:
```$ export PS1='\[\e[32m\u\] \[\e[36m\w\] \[\e[33m\]\[\e[1m\]$ \[\e[0m\]```

## TO-DOs
- Add one comment per person mechanism
- Review how the FollowerTier relationship is stored. Current approach is most likely flawed. Should include the FollowNFT.
- Replace some contracts with interfaces on imports

## To-Learn
- How to use docker. We ended up just yeeting it, after wastign some time with it.
- How to properly set up the IDE for Solidity coding. For some reason it only caugths basic syntax error but not type errors or undefined variables or anything more subtle so we wasted a lot of time compiling to see errors.
- How to properly set up the IDE for Javascript. We had some clashes in the linting for Typescript and React.
- How to test in hardhat. Tried it quickly, gave up, continued writing everything as tasks
- More advanced Solidity debugging. I wasn't able to see raised events with hardhat, so I was blind most of the time. Also, a traditional debugger would be awesome.
- Setting up debugging for hardhat. Tests also gave me some pain
- Get used to typescript. It's a bit more effort figuring out what type is everything, but it caughts errors without waiting for all of the code to run.
- 