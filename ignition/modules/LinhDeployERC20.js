const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LockModule", (m) => {

    const contract = m.contract("ERC20byLinh", ["maimaituoi20"]);
    return { contract };
});