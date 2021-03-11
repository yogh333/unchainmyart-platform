var EthereumDidRegistry = artifacts.require("./EthereumDidRegistry");

module.exports = function(deployer) {
  deployer.deploy(EthereumDidRegistry);
};