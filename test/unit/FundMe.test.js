const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function() {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1"); //1 eth
  beforeEach(async function() {
    // const accounts = await ethers.getSigners();
    // const accountZero = accounts[0];
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async function() {
    it("Sets the aggregator addresses correctly", async function() {
      const response = await fundMe.PriceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("fund", async function() {
    it("Should fail if you don't send enough ETH", async function() {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("Updated the amount funded data structure", async function() {
      await fundMe.fund({ value: sendValue });
      console.log(deployer);
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Adds funder to array of funders", async function() {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getFunder(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async function() {
    beforeEach(async function() {
      await fundMe.fund({ value: sendValue });
    });
    it("Withdraw ETH from a single founder", async function() {
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getbalance(
        deployer
      );
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance + startingDeployerBalance,
        endingDeployerBalance.add(gasCost).toString()
      );
    });
  });
});
