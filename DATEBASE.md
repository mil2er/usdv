# Database

存储统计数据 

## Database

```
CREATE DATABASE `statistic` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
```

### Table

- 持有人
  - eth_holder
  - trx_holder
- 转账次数
  - eth_transfer
  - trx_transfer
- 转账金额
  - eth_amount
  - trx_amount
- 流通量
  - eth_circulating_supply
  - trx_circulating_supply

```
CREATE TABLE IF NOT EXISTS TABLE (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  day DATE NOT NULL COMMENT '日期（年月日）',
  value DECIMAL(15, 0) NOT NULL DEFAULT 0.0000 COMMENT '数值度量值',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  
  PRIMARY KEY (id),
  INDEX idx_day (day) COMMENT '日期索引'
) 
ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_0900_ai_ci
```
