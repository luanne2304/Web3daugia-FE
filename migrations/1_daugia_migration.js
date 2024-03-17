const Daugiacontract = artifacts.require("Daugiacontract");

module.exports = function (deployer) {
  deployer.deploy(Daugiacontract,43200,"0x13b6546f3b6f543231b822cbC2b697140a3b62A5");
};