### 1.Preparation
* Install **Node.js** and **Hardhat**
* Copy [secrets_sample.json](secrets_sample.json) to secrets.json and configure it with your settings

### 2.Install Dependencies
```
npm install
```

### 3.Compile Contracts
```
npx hardhat compile
```

### 4.Run Test
```
npx hardhat test scripts/test.js --network hardhat
```

### 5.Deploy Contracts
**To Sepolia Testnet**

Ensure your wallet has enough ETH for gas fees.
```
npx hardhat run --network sepolia scripts/deploy.js
```

**To Mainnet**

Proceed with caution. Double-check configurations.
```
npx hardhat run --network mainnet scripts/deploy.js
```

### 6.Verify and Publish
**Verify implementation address**
```
npx hardhat verify --network sepolia usdv.address
```
**Proxy Contract link to implementation address**
### 

