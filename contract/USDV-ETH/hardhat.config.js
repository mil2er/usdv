/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

const {alchemyApiKey, sepoliaPrivateKey, mainnetPrivateKey, etherscanApiKey} = require('./secrets.json');

module.exports = {
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks:{
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
            accounts: [`${sepoliaPrivateKey}`]
        },
        mainnet: {
            url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
            accounts: [`${mainnetPrivateKey}`]
        }
    },
    etherscan: {
        apiKey: {
            sepolia: `${etherscanApiKey}`,
            mainnet: `${etherscanApiKey}`
        }
    },
    sourcify: {
        enabled: true
    }
};
