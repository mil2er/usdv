### 1.Preparation
* Install **Node.js** and **Tronbox**
* Copy [secrets_sample.json](secrets_sample.json) to secrets.json and configure it with your settings

### 2.Install Dependencies
```
npm install
```

### 3.Compile Contracts
```
tronbox compile
```

### 4.Deploy Contracts
**To nile Testnet**

* Ensure your wallet has enough TRX for gas fees.
* Configure process.env.PRIVATE_KEY_NILE.
```
tronbox deploy --network nile --reset
```

**To Mainnet**

* Proceed with caution. Double-check configurations
* Configure process.env.PRIVATE_KEY_MAINNET
```
tronbox deploy --network mainnet
```

### 5.Verify contract code
**Flatten contract code**
```
tronbox flatten ./contracts/proxy.sol >  ERC1967Proxy_flatten.sol
```
```
tronbox flatten ./contracts/USDV.sol >  USDV_flatten.sol
```
Note: The Tronbox flatten tool has a bug when handling multiple // SPDX-License-Identifier: MIT comments. You may need to manually fix this in the flattened file.

**Verify contract code at tronscan**

(Follow Tronscan's verification process for the flattened contracts.)

### 6.Adjust "Energy Consumption Ratio"
Note: only contract creator can change "Energy Consumption Ratio"
