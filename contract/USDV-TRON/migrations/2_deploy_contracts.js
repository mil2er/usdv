const USDV = artifacts.require('USDV');
const ERC1967Proxy = artifacts.require('ERC1967Proxy');
const {defaultAdminAddress, pauserAddress,minterAddress,upgraderAddress,blacklistAdminAddress} = require('../secrets.json');

module.exports = async function (deployer) {
    try {
        await deployer.deploy(USDV);
        const impl = await USDV.deployed();
        console.log("Deployed impl address:", impl.address);

        await deployer.deploy(
            ERC1967Proxy,
            impl.address,
            "0x"
        );
        const proxy = await ERC1967Proxy.deployed();
        console.log("Deployed proxy address:", proxy.address);

        const proxied = await USDV.at(proxy.address);
        await proxied.initialize(
            `${defaultAdminAddress}`,
            `${pauserAddress}`,
            `${minterAddress}`,
            `${upgraderAddress}`,
            `${blacklistAdminAddress}`
        );

    } catch (error) {
        console.error('Transparent: deploy box error', error);
    }
};
