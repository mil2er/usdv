
# 接口文档说明


## 请求路径

uri 统一前缀 /api/[chain]

|  chain | uri |
|  ---- | ---- |
| 以太坊 | /api/eth |
| 波场 | /api/tron |

## 响应体

返回消息体，后面文档只写 data 部分

|  name   | type  | memo |
|  ----  | ----  | ----  |
| code  | String | 状态码 0成功 其它均为错误码 |
| message | String | 说明消息 |
| data  | String or Map | 业务数据 |

## 静态初始化配置数据读取接口

GET /api/[chain]/config

```shell
curl http://127.0.0.1:20002/api/eth/config -X GET -H "Content-Type: application/json" | jq '.'

{
  "code": 0,
  "data": {
    "coin_name": "ETH_USDV",
    "name": "USD Vault",
    "symbol": "USDV",
    "address": "0x2fb07c66479cc5d45f8ca2db386b400453d78983",
    "decimals": 6,
    "chain": "ETHEREUM",
    "network": "sepolia",
    "BLACKLIST_ADMIN_ROLE": "0x750555ed2187fef9a15b1b2d80b65634c266437a86c68f049ea8b5da4a2bd96d",
    "BLACKLIST_ROLE": "0x22435ed027edf5f902dc0093fbc24cdb50c05b5fd5f311b78c67c1cbaff60e13",
    "DEFAULT_ADMIN_ROLE": "0x1effbbff9c66c5e59634f24fe842750c60d18891155c32dd155fc2d661a4c86d",
    "DOMAIN_SEPARATOR": "0x5dae01a50c13cd5552b17e2e742678152a2bd272063ae85218fa1cda91353a79",
    "MINTER_ROLE": "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    "PAUSER_ROLE": "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
    "UPGRADER_ROLE": "0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3",
    "UPGRADE_INTERFACE_VERSION": "0x56c66b2cbf206f146f5fb80dadf1a855a6a375d07396966e8f1fa6b03f61023a"
  },
  "message": "success"
}
```

## 地址余额查询

GET /api/[chain]/balanceOf/{contract}?address= 


- req

|  arg name   | type  |
|  ----  | ----  |
| address  | String |

- return 

|  name   | type  | memo |
|  ----  | ----  | ----  |
| balance  | String |  |

```shell
curl http://127.0.0.1:7001/api/eth/balanceOf/0x2fb07c66479cc5d45f8ca2db386b400453d78983?address=0x564dBD304d118014d6F07d75d2d159F52d8deA06 \
    -X GET -H "Content-Type: application/json"

{
  "code": 0,
  "data": {
    "balance": "300999989"
  },
  "message": "success"
}

curl "http://127.0.0.1:20002/api/tron/balanceOf/TAET2R9VnVfKvDgzEbzAgxTkAfyMSzrHFx?address=TESzMLyDLcA9qqYt1fDqtJEoUf5ZBh17a5" \
    -X GET -H "Content-Type: application/json"

{
  "code": 0,
  "data": {
    "balance": "123456789"
  },
  "message": "success"
}
```

## 授权额度查询

GET /api/[chain]/allowance/{contract}?owner=&spender=

- req

|  arg name   | type  |
|  ----  | ----  |
| owner  | String |
| spender | String |

- return 

|  name   | type  | memo |
|  ----  | ----  | ----  |
| allowance  | String |  |

```shell
curl "http://127.0.0.1:7001/api/eth/allowance/0x2fb07c66479cc5d45f8ca2db386b400453d78983?owner=0x6625eE82631D9f8bba6cCeba123B341f4c748be8&spender=0x564dBD304d118014d6F07d75d2d159F52d8deA06" -X GET -H "Content-Type: application/json" | jq '.'

{
  "code": 0,
  "data": {
    "allowance": "9876555"
  },
  "message": "success"
}
```

## Safe 官方API 服务

[https://docs.safe.global/core-api/transaction-service-reference/sepolia#Transactions](https://docs.safe.global/core-api/transaction-service-reference/sepolia#Transactions)

## 创建多签交易

POST /api/[chain]/safe/safes/{address}/multisig-transactions/

## 查询多签交易列表

GET /api/[chain]/safe/safes/{address}/multisig-transactions/

## 估算多签交易费用

POST /api/[chain]/safe/safes/{address}/multisig-transactions/estimations/

## 删除队列中的多签交易

DELETE /api/[chain]/safe/multisig-transactions/{txhash}/

## 查询多签交易信息

GET /api/[chain]/safe/multisig-transactions/{txhash}/

## 确认多签交易

POST /api/[chain]/safe/multisig-transactions/{txhash}/confirmations/

## 查询多签交易确认列表

GET /api/[chain]/safe/multisig-transactions/{txhash}/confirmations/

## 广播交易

- POST /api/[chain]/broadcasttx 
- request body

|  arg name   | type  |
|  ----  | ----  |
| signed tx_data  | String(json) |

tx_data 示例：
```json
{
  "raw_data": {
    "contract": [
      {
        "parameter": {
          "value": {
            "amount": 1000,
            "owner_address": "41608f8da72479edc7dd921e4c30bb7e7cddbe722e",
            "to_address": "41e9d79cc47518930bc322d9bf7cddd260a0260a8d"
          },
          "type_url": "type.googleapis.com/protocol.TransferContract"
        },
        "type": "TransferContract"
      }
    ],
    "ref_block_bytes": "5e4b",
    "ref_block_hash": "47c9dc89341b300d",
    "expiration": 1591089627000,
    "timestamp": 1591089567635
  },
  "raw_data_hex": "0a025e4b220847c9dc89341b300d40f8fed3a2a72e5a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a1541608f8da72479edc7dd921e4c30bb7e7cddbe722e121541e9d79cc47518930bc322d9bf7cddd260a0260a8d18e8077093afd0a2a72e"
}
```

- return List分页显示

|  name   | type  | memo |
|  ----  | ----  | ----  |
| txId  | String |  |


##  基本信息

GET /api/[chain]/info

- req

- return

|  name   | type  | memo |
|  ----  | ----  | ----  |
| totalSupply  | String| |
| circulatingSupply  | String| 流通供应量|
| marketCap  | String| 市值 |
| circulatingMarketCap  | String| 流通市值|
| contract  | String| 合约地址 |
| issuer  | String| 发行方 |
| issuingTime  | String| |
| decimal  | String| 小数点位数 |
| holders  | String | 持币地址数 |
| cumulativeTransfers  | String | 累计转账次数 |
| yesterdayTransfers  | String|  昨日转账次数|
| yesterdaytradingVolume  | String|  昨日交易量|

```shell
curl -X GET http://127.0.0.1:20002/api/eth/info     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": {
    "circulatingMarketCap": "100000000000000",
    "circulatingSupply": "100000000000000",
    "contract": "100000000000000",
    "cumulativeTransfers": "100000000000000",
    "decimal": "100000000000000",
    "holders": "100000000000000",
    "issuer": "100000000000000",
    "issuingTime": "100000000000000",
    "marketCap": "100000000000000",
    "tag": "sample",
    "totalSupply": "100000000000000",
    "yesterdayTransfers": "100000000000000",
    "yesterdaytradingVolume": "100000000000000"
  },
  "message": "success"
}

curl -X GET http://127.0.0.1:20002/api/tron/info     -H "Accept: application/json"     -H "content-type: application/json"
```

## 交易查询(需要分页)

GET /api/[chain]/transactions

- req

|  arg name   | type  |
|  ----  | ----  |
| page  | int |
| size  | int |
| status  | String(ALL Pending Signed Failed Success) |


- return List分页显示

参考 https://app.safe.global/transactions/history?safe=sep:0xd1Bacd07414C51aA16f4480B80f65a51d67D8fEe
|  name   | type  | memo |
|  ----  | ----  | ----  |
| txType  | String | mint burn transfer... |
| status  | String |  |
| txHash  | String |  |

```shell
curl -X GET http://127.0.0.1:20002/api/eth/transactions     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": [
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    },
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    },
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    }
  ],
  "message": "success"
}
```

##  与我相关的交易查询(需要分页)

GET /api/[chain]/myTransactions

- req

|  arg name   | type  |
|  ----  | ----  |
| page  | int |
| size  | int |
| status  | String(ToSign Pending Signed Failed Success) |


- return List分页显示

参考 https://app.safe.global/transactions/history?safe=sep:0xd1Bacd07414C51aA16f4480B80f65a51d67D8fEe
|  name   | type  | memo |
|  ----  | ----  | ----  |
| txType  | String | mint burn transfer... |
| status  | String |  |
| txHash  | String |  |

```shell
curl -X GET http://127.0.0.1:20002/api/eth/myTransactions/0x000     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": [
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    },
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    },
    {
      "status": "success",
      "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "txType": "transfer"
    }
  ],
  "message": "success"
}
```

##  流通供应量统计

GET /api/[chain]/statistic/circulatingSupply

- req

- return 最长30数组

|  name   | type  | memo |
|  ----  | ----  | ----  |
| day  | String | 日期 |
| circulatingSupply  | String | 当日流通供应量|

```shell
curl -X GET http://127.0.0.1:20002/api/eth/statistic/circulatingSupply     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": [
    {
      "day": "2025-01-01",
      "circulatingSupply": "100000000000"
    },
    {
      "day": "2025-01-02",
      "circulatingSupply": "200000000000"
    },
    {
      "day": "2025-01-03",
      "circulatingSupply": "400000000000"
    }
  ],
  "message": "success"
}
```

##  转账次数统计

GET /api/[chain]/statistic/transfers

- req

- return 最长30数组

|  name   | type  | memo |
|  ----  | ----  | ----  |
| day  | String | 日期 |
| transfers  | String | 当日转账次数|

```shell
curl -X GET http://127.0.0.1:20002/api/eth/statistic/transfers     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": [
    {
      "day": "2025-01-01",
      "transfers": "100000000000"
    },
    {
      "day": "2025-01-02",
      "transfers": "200000000000"
    },
    {
      "day": "2025-01-03",
      "transfers": "400000000000"
    }
  ],
  "message": "success"
}
```

## 持币地址统计

GET /api/[chain]/statistic/holders

- req

- return 最长30数组

|  name   | type  | memo |
|  ----  | ----  | ----  |
| day  | String | 日期 |
| holders  | String | 持币地址数 |

```shell
curl -X GET http://127.0.0.1:20002/api/eth/statistic/holders     -H "Accept: application/json"     -H "content-type: application/json"

{
  "code": 0,
  "data": [
    {
      "day": "2025-01-01",
      "holders": "100000000000"
    },
    {
      "day": "2025-01-02",
      "holders": "200000000000"
    },
    {
      "day": "2025-01-03",
      "holders": "400000000000"
    }
  ],
  "message": "success"
}
```
