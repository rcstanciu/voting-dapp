const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { getBlockTimestamp } = require("./utils");

describe("Vote session", function () {
  let contract;
  let owner;
  let accounts;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    // Deploy VoteSession contract
    const VoteSession = await ethers.getContractFactory("VoteSession");
    const startDate = (await getBlockTimestamp()) + 300; // NOW + 5 minutes
    const duration = 600; // 10 minutes

    contract = await VoteSession.deploy(startDate, duration);

    await contract.deployed();
  });

  it("should initialize", async () => {
    expect(contract).to.be.ok;

    // Check that the vote session starts in the CANDIDATE_REGISTRATION_OPEN state
    expect(await contract.voteStatus()).to.equal(0); // Status.CANDIDATE_REGISTRATION_OPEN == 0
  });

  it("should set ownership correctly", async () => {
    // Fetch contract owner
    expect(await contract.owner()).to.be.equal(owner.address);
  });

  it("should allow candidate registration after creation", async function () {
    // Register candidate
    const tx = await contract.registerCandidate(
      owner.address,
      "Contract owner"
    );
    await tx.wait();

    // Check that the candidate has been registered successfully
    const candidate = await contract.candidates(owner.address);
    expect(candidate.name).to.be.equal("Contract owner");
    expect(candidate.wallet_address).to.be.equal(owner.address);
    expect(candidate.registered_at).to.be.equal(await getBlockTimestamp());
  });

  it("should not allow registering twice", async function () {
    // Register candidate
    let tx = await contract.registerCandidate(owner.address, "Contract owner");
    await tx.wait();

    await expect(contract.registerCandidate(owner.address, "New name")).to.be
      .reverted;
  });

  it("should allow starting the vote with candidates and after the start date", async () => {
    const numberOfCandidates = await contract.numberOfCandidates();
    expect(numberOfCandidates).to.equal(0);

    // Should not be able to start the voting without candidates and before the start date
    await expect(contract.start()).to.be.reverted;

    // Should not be able to start the voting with candidates but before the start date
    for (let i = 0; i < 3; i++) {
      const tx = await contract.registerCandidate(
        `0x000000000000000000000000000000000000000${i + 1}`,
        "Contract owner"
      );
      await tx.wait();
      await expect(contract.start()).to.be.reverted;
    }

    // Should be able to start the voting in optimum conditions
    await network.provider.send("evm_setNextBlockTimestamp", [
      (await getBlockTimestamp()) + 300,
    ]);

    await expect(contract.start()).to.be.ok;
    expect(await contract.voteStatus()).to.equal(1); // Status.VOTING == 1
  });
});
