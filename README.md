# [Voting Dapp](https://voting-dapp.rstanciu.com/) &middot; ![build](https://vercelbadge.vercel.app/api/rcstanciu/voting-dapp)

Simple dapp where users can initiate voting sessions and cast votes. Everything is stored on chain.

### Structure

The project is comprised of two directories:

- `hardhat` directory holds the Hardhat project, containing contracts, deployment scripts and testing suites.
- `react` directory holds the NextJS project: the frontend used to start elections, register candidates, cast votes and view the results.

### Initial Requirements

1. Create a dapp for voting where all of the votes and candidate registration happens on chain.
2. Allow anyone to start an election with a registration period, voting period, and ending time. 
3. Allow anyone to sign up as a candidate during the registration period, and allow anyone to vote once during the voting period. 
4. Create a front-end where voters can see the results and know how long is left in the election.

### License
Voting Dapp is [MIT Licensed](./LICENSE.md).
