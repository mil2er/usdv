const USDV = artifacts.require('USDV');
const {defaultAdminAddress, pauserAddress,minterAddress,upgraderAddress,blacklistAdminAddress} = require('../secrets.json');

module.exports = async function (deployer) {
    try {
        await deployer.deploy(
            USDV,
            `${defaultAdminAddress}`,
            `${pauserAddress}`,
            `${minterAddress}`,
            `${blacklistAdminAddress}`
        );
        const usdv = await USDV.deployed();
        console.log("Deployed USDV address:", usdv.address);

    } catch (error) {
        console.error('Transparent: deploy box error', error);
    }
};
