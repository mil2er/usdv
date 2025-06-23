const {ethers, upgrades} = require('hardhat');
const {
    defaultAdminAddress,
    pauserAddress,
    minterAddress,
    upgraderAddress,
    blacklistAdminAddress
} = require('../secrets.json');

async function main() {
    const USDV = await ethers.getContractFactory('USDV');
    console.log('Deploying USDV...');
    const usdv = await upgrades.deployProxy(
        USDV,
        [`${defaultAdminAddress}`,
            `${pauserAddress}`,
            `${minterAddress}`,
            `${upgraderAddress}`,
            `${blacklistAdminAddress}`
        ],
        {
            initializer: 'initialize',
            kind: 'uups',
            gasPrice: 1
        });
    await usdv.waitForDeployment();
    console.log('usdv deployed to:', await usdv.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });