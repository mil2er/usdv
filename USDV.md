# USDV ETH 用户手册

## 配置

```text
需要API key 和账户私钥用于部署合约：

https://www.alchemy.com/
注册并获取API key

https://etherscan.io/
注册并获取API key

使用Metamask 创建账户并复制地址及私钥，并配置文件 secrets.json
出于安全考虑，可配置不同的权限账户地址，或者在合约创建成功后，调用合约方法修改：

{
  "alchemyApiKey": "aaaaaa",
  "etherscanApiKey": "eeeeee",
  "sepoliaPrivateKey": "ssssss",
  "mainnetPrivateKey": "mmmmmm",
  "defaultAdminAddress": "0x******aaaaaa",
  "pauserAddress": "0x******aaaaaa",
  "minterAddress": "0x******aaaaaa",
  "upgraderAddress": "0x******aaaaaa",
  "blacklistAdminAddress": "0x******aaaaaa"
}

```

## 环境部署与合约编译

```text
$ sudo apt install nodejs

$ node -v
v18.19.1

$ sudo apt install npm

$ npm -v
9.2.0
```

## 授权操作与查询

```
https://sepolia.etherscan.io/address/0x2fb07c66479Cc5d45f8ca2dB386B400453d78983#readProxyContract
BLACKLIST_ADMIN_ROLE      0x750555ed2187fef9a15b1b2d80b65634c266437a86c68f049ea8b5da4a2bd96d
BLACKLIST_ROLE            0x22435ed027edf5f902dc0093fbc24cdb50c05b5fd5f311b78c67c1cbaff60e13
DEFAULT_ADMIN_ROLE        0x0000000000000000000000000000000000000000000000000000000000000000
DOMAIN_SEPARATOR          0x3e97dabda5c2aa060f7c12b1708384b9eccc1b419cc0047d4a81cd2c1fefea84
MINTER_ROLE               0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
PAUSER_ROLE               0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a
UPGRADER_ROLE             0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3
UPGRADE_INTERFACE_VERSION 5.0.0

https://sepolia.etherscan.io/address/0x2fb07c66479Cc5d45f8ca2dB386B400453d78983#writeProxyContract

添加授权
grantRole (0x2f2ff15d)
0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
0xd1Bacd07414C51aA16f4480B80f65a51d67D8fEe

取消授权
revokeRole (0xd547741f)
0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
0x564dBD304d118014d6F07d75d2d159F52d8deA06

查询授权列表
注意，因为授权角色为数组，需要查询授权列表以便确保没有遗漏的账户。
getRoleMembers
0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6

调用mint 方法
mint (0x40c10f19)
0x564dBD304d118014d6F07d75d2d159F52d8deA06
100000000
地址没有权限交易失败：
https://sepolia.etherscan.io/tx/0x0a00f06196c783a0fd7c949433d77ad1c2fd4802e4c468d2f7a29956e233e0ef

```

## 创建多签交易

```text
可以单独添加交易提案权限账户，该权限账户仅能创建交易不能签发。

https://app.safe.global/
创建账户会创建一个支持多签的钱包地址，能够导出，并可在其他多签账户地址持有人账户导入。
导入多签账户后便能够在safe中查询到该多签账户下创建的多签交易。

在safe 界面中左侧面板有个 “New trasaction” 按钮，添加新交易;
在 “New trasaction“ 弹出框中点击 “Transaction Builder”;
在 “New Transaction” 的参数配置框输入如下参数：
    * 在 ”Enter Address or ENS Name“ 复制要执行的合约代理地址；
    * 注意：ABI 会自动装载，不需要手动输入；
    * 点选 “Custom data”，在展开的参数中输入：
        * ETH value*: 0 (用于eth转账，一般合约调用为0即可，gas费会另外计算)；
        * Data(Hex encorded)*: 输入参数的data 编码：
            * 可以在Metamask 查询获取；
            * 或者使用在线编码工具生成[https://abi.hashex.org/](https://abi.hashex.org/)；
    * 点击 “Add new transaction” 创建交易
```

## 签发和执行多签交易



## 测试用例

### 权限配置

测试账户  

```text
共创建9个账户：  
      * 1个部署账户（ $0 ）需导出私钥配置到合约项目中用于部署合约；  
    其中五个为交易签发执行权限账户：  
      * 2个ledger创建的账户（ $1, $2 ）；  
      * 3个浏览器钱包账户（ Metamask $3, Coinbase $4, Trust $5 ）；  
    三个普通账户：
      * 1个交易提案权限账户（ $6 ），仅能创建多签交易，没有权限签发；  
      * 2个独立账户（ Metamask $7, Coinbase $8 ），没有任何授权，用于测试转账等交易；  

$0: 0x564dBD304d118014d6F07d75d2d159F52d8deA06 # 合约部署账户；所有管理权限初始持有账户；  
$1: 0x2E04C563C961E3E1f8576CFBD11ffeedf8885aF4
$2: 0x1d068a5C61A799a1F95Cf422a87CD5F008C539bD
$3: 0x2201A0C047135Ae57dde4612606b3f31d8770831
$4: 0x976Ee1eB641413FCeA26e6Acab31B042C8fF8b77 # test-usdv-4 coinbase
$5: 0x3FAf8616F636484E81946087f3d4113BCcB6721f # test-usdv-5 trust
$6: 0x941229dcf9f9C5dBF32bbB71dFf31CA0403e51d6 # 创建交易账户  
$7: 0x6f18Bb39dF67302816Bb762BCcB7c076E524f935 # test-usdv-7 coinbase
$8: 0x6625eE82631D9f8bba6cCeba123B341f4c748be8 # test-usdv-8 trust 无法链接Etherscan：报错

使用合约部署账户（$0），配置到所有权限初始配置中：

部署合约；  
合约地址：
```

### 初始单账户测试

```text
Burnable：

    查询：balanceOf, allowance, totalSupply；
    测试：mint，approve，burn，burnFrom，transfer：

    测试mint：
        查询balanceOf：确认初始持有账户（$0）拥有 0；
        调用mint：mint（$0）500000000；
        查询balanceOf：确认初始持有账户（$0）拥有 500000000；

    测试burn；
        查询balanceOf：确认初始持有账户（$0）拥有 500000000；
        调用burn：burn 50000000；
        查询balanceOf：确认初始持有账户（$0）拥有 0；
        查询totalSupply：查询为 0；
        调用burn：burn 1：Fail；

    测试burnFrom；
        调用mint：mint（$0）500000000；
        查询balanceOf：确认初始持有账户（$0）拥有 500000000；
        调用transfer：向独立账户（$7）转账 200000000；
        查询balanceOf：确认初始持有账户（$7）拥有 200000000；
        调用burnFrom：销毁独立账户（$7）的 11：Fail with error 'ERC20InsufficientAllowance；
        查询allowance：（$7）spender（$0）0；
        调用approve (0x095ea7b3)：（$7）spender（$0）10000000；
        查询allowance：（$7）spender（$0）10000000；
        调用burnFrom：销毁独立账户（$7）的 11：
        查询allowance：（$7）spender（$0）9999989；
        查询balanceOf：确认初始持有账户（$7）拥有 199999989；
        调用approve (0x095ea7b3)：（$7）spender（$0）1000000000；
        查询allowance：（$7）spender（$0）1000000000；
        调用burnFrom：销毁独立账户（$7）的 200000000：Fail with error 'ERC20InsufficientBalance；
        查询balanceOf：确认初始持有账户（$7）拥有 199999989；

ERC20：

    查询：balanceOf，allowance；
    测试：approve，transfer，transferFrom，increaseAllowance，decreaseAllowance：

        查询balanceOf：确认目标账户（$8）拥有 0；
        查询allowance：（$8）spender（$0）确认为 0；
        调用transferFrom：from（$8）to（$0）：Fail with error 'ERC20InsufficientAllowance；
        调用approve授权：（$8）spender（$0）授权 10000000；
        查询allowance：（$8）spender（$0）确认为 10000000；
        调用transferFrom：from（$8）to（$0）33：Fail with error 'ERC20InsufficientBalance；
        查询allowance：（$8）spender（$0）确认为 10000000；
        调用transferFrom：（$0）签发，从独立账户（$7）转账给（$8）33，确认交易成功；
        查询allowance：（$7）spender（$0）授权确认剩余 999999967；
        查询balanceOf：确认账户余额（$7）拥有 199999956；
        查询allowance：（$8）spender（$0）确认为 10000000；
        查询balanceOf：确认账户余额（$8）拥有 33；
        调用increaseAllowance：（$8）增加 11；
        查询allowance：（$8）确认为 10000011；
        调用decreaseAllowance：（$8）减少 123456：
        查询allowance：（$8）确认为 9876555；
        调用transfer：（$7）签发，从独立账户（$7）转账给（$8） 123400，确认交易成功；
        查询balanceOf：确认独立账户（$7）拥有 199876556；
        查询balanceOf：确认独立账户（$8）拥有 123433；

Pause 测试：

    测试各个基础功能在pause前后是否能调用成功；

    查询：balanceOf，paused，getRoleMemberCount，getRoleMembers，getRoleMember，hasRole
    测试：pause，mint，burn，burnFrom，transfer，transferFrom，grantRole，revokeRole

        调用pause (0x8456cb59)：Success；
        查询paused()状态： True；

          查询balanceOf（$0）300000000；
          调用mint (0x40c10f19)（$0）1000000：Fail with error 'EnforcedPause ()'；
          查询balanceOf（$0）300000000；
          调用burn (0x42966c68)：Fail with error 'EnforcedPause ()'；
          查询balanceOf（$0）300000000；
          调用burnFrom (0x79cc6790)（$7）：Fail with error 'EnforcedPause ()'

          调用transfer (0xa9059cbb)（$0）签发 from（$0）to（$7）：Fail with error 'EnforcedPause ()'
          调用transferFrom (0x23b872dd)（$0）签发 from（$7）to（$8）：Fail with error 'EnforcedPause ()'
          调用transfer (0xa9059cbb) from（$8）to（$7）：Fail with error 'EnforcedPause ()'

          查询getRoleMemberCount mint_role权限：1
          调用grantRole (0x2f2ff15d) 授权（$4）mint_role权限：Success；
          查询getRoleMembers mint_role权限：可查到（$4）；
          查询getRoleMemberCount mint_role权限：2
          查询getRoleMember mint_role权限 index 1：可查询到（$4）；
          查询hasRole mint_role权限（$4）：true；
          调用revokeRole (0xd547741f) 撤销授权（$4）mint_role权限：Success；
          查询getRoleMembers mint_role权限：（$4）已删除；
          查询getRoleMemberCount mint_role权限：1

        调用unpause (0x3f4ba83a)：Success；
        查询paused()状态： False；

          查询balanceOf（$0）300000000；
          调用mint (0x40c10f19)（$0）1000000：Success；
          查询balanceOf（$0）301000000；
          调用burn (0x42966c68) 11：Success；
          查询balanceOf（$0）300999989；
          查询balanceOf（$7）199876556；
          查询allowance（$7）spender（$0）：999999967；
          调用burnFrom (0x79cc6790)（$7）111：Success；
          查询allowance（$7）spender（$0）：999999856；
          查询totalSupply：500999867；

          调用transfer (0xa9059cbb)（$0）签发 from（$0）to（$7）：Success；
          查询balanceOf（$0）；
          查询balanceOf（$7）；
          调用transferFrom (0x23b872dd)（$0）签发 from（$7）to（$8）：Success；
          查询balanceOf（$7）；
          查询balanceOf（$8）；
          调用transfer (0xa9059cbb) from（$8）to（$7）：Success；
          查询balanceOf（$8）；
          查询balanceOf（$7）；

？getRoleAdmin
？DEFAULT_ADMIN_ROLE
？permit
？upgrade
？创建的多签交易没有完成多签之前是否已经上链？
？多签配置修改后，执行中的多签交易按照新配置还是旧配置完成？
？解析多签合约交易

```

### 多签权限管理功能测试

```text
？？？

创建Safe 多签账户

role

??? renounceRole (0x36568abe)

mint 授权多签账户

查询mint授权账户列表

取消合约部署账户的mint 权限

测试合约部署账户调用mint 账户（$0）是否因权限原因执行失败


？授权状态下，将地址（$0）加入黑名单，

是否可执行权限功能

？撤销权限状态下，将地址（）加入黑名单

？恢复权限

？？？
```

### 多签基本功能测试

```text
使用多签账户重复初始账户测试
……
```

