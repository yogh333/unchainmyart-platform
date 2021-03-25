var EthereumDidRegistry = artifacts.require("./EthereumDidRegistry");
var UnchainMyArt = artifacts.require("./UnchainMyArt");

module.exports = function(deployer) {
  deployer.deploy(EthereumDidRegistry);
  deployer.deploy(UnchainMyArt);
};