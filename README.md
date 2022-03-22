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

## Notes:
- The scripts can be found and edited under the `tasks` folder.
- If finding the previous comand prompt inside the docker bash is too anoying then run this:
```$ export PS1='\[\e[32m\u\] \[\e[36m\w\] \[\e[33m\]\[\e[1m\]$ \[\e[0m\]```