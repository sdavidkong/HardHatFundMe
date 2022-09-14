const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  const fundMe = await deploy("Fundme", {
    from: deployer,
    args: [],
  });
};