## SQL

### Join（联接）

#### 引入

![截屏2024-07-16 11.36.49](http://198.46.215.27:49153/i/6695ead864fcb.png)

加入饲养员和笼子的关系如上所示

Schema:

- Animals: (aid, name, age, species, acageno)
- Cages(no, feedtime, bldg)
- Keepers(id, name)
- keeps(kid, cageno)



**找到32号建筑物中的所有笼子**

- 命令式

  ```
  for each row a in animals:
  	for each row c in cages:
  		if a.acageno = c.no and c.bldg = 32
  			output a
  ```

- 声明式

  ```sql
  SELECT name
  FROM animals, cages
  WHERE acageno = no AND bldg = 32;
  ```

- 另外一种声明式语法

  ```sql
  SELECT name
  FROM animals JOIN cages on acageno = no
  WHERE bldg = 32;
  ```

  

### 别名与歧义

![截屏2024-02-18 21.30.26](http://198.46.215.27:49153/i/6695f062a140d.png)

**例子： 喂养熊的所有饲养员**

```sql
SELECT name FROM keepers JOIN keeps ON id = kid
JOIN cages on cageno = no
JOIN animals on cageno = no
Where species = 'bear'
```

> 这个sql语句并不能使用，为什么？

因为 SELECT name 时候这个name的指代不明确，没有指明是哪个实体。改成animals.name即可

### 聚合

**例子： 找到每个笼子由多少个饲养员管理**

```sql
SELECT no, count(*)
FROM cages JOIN keeps ON on=cageno
GROUP BY no
```

> 那没有饲养员管理的笼子呢？

可以使用右联或者外联

> [!IMPORTANT]
>
> count(*)， 所有行都被统计（包括NULL）
>
> count(col) ，只统计非空的值的行

### Join（联接）

#### 左联

```sql
T1 LEFT JOIN T2 ON pred
```

- 所有满足 `pred` 条件的 `T1 x T2` 行。

- 以及 `T1` 中没有与 `T2` 中任何行匹配的所有行（这些行的 `T2` 列值将为空）。

#### 右联

与左联类似，但是方向相反

```sql
T1 LEFT JOIN T2 ON pred
```

- 所有满足 `pred` 条件的 `T1 x T2` 行。

- 以及 `T2` 中没有与 `T1` 中任何行匹配的所有行（这些行的 `T1` 列值将为空）。

#### 外联/全联

即把左联结果表+右联结果表组合在一起，然后过滤掉重复的

```sql
T1 OUTER JOIN T2 ON pred
```

#### 内联（默认）

```sql
T1 INNER JOIN T2 ON pred
# 或者直接
T1 JOIN T2 ON pred
```

- 所有满足 `pred` 条件的 `T1 x T2` 行
- 如果某行在其中一个表中没有匹配的行，那么这行将不会出现在结果集中

#### 自联

**例子，查找照顾熊和长颈鹿的所有管理员**

```sql
SELECT keepers.name
FROM keepers JOIN keeps ON id = kid
JOIN cages ON cageno = no
JOIN animals ON acageno =cageno
WHERE species = 'Bear' AND = species = 'Giraffe'
```

> 这个SQL并没有效果，为什么？

需要构建两个表，Bear keepers 和 Giraffe keepers，然后取交集 

**先构建Bear keepers表**

![image-20240716175623140](http://198.46.215.27:49153/i/669643ca5ca5f.png)



![image-20240716175718377](http://198.46.215.27:49153/i/66964401c8d10.png)

**再构建Giraffe keepers表**

![截屏2024-07-16 17.59.04](http://198.46.215.27:49153/i/6696447286c80.png)

**最后联接**

![截屏2024-07-16 17.59.46](http://198.46.215.27:49153/i/6696449ba2f3d.png)



## SQL必要练习 + 论文阅读

1、 [完成SQL的练习]([1. SQL — A Practical Introduction to Databases (runestone.academy)](https://runestone.academy/ns/books/published/practical_db/PART1_SQL/index.html))

2、 [完成关系模型（3.1节）的练习]([3. RELATIONAL DATABASE THEORY — A Practical Introduction to Databases (runestone.academy)](https://runestone.academy/ns/books/published/practical_db/PART3_RELATIONAL_DATABASE_THEORY/index.html))

3、 阅读参考书上的Michael Stonebraker和Joseph Hellerstein的文章《What Goes Around Comes Around》中的第1至4节

4、（可选）关系模型的开山鼻祖论文； E.F. Codd. A relational model of data for large shared data banks. Communications of the ACM, 1970.[[PDF](http://portal.acm.org/ft_gateway.cfm?id=362685&type=pdf&coll=GUIDE&dl=GUIDE&CFID=1781172&CFTOKEN=98614393)].

回答以下问题：

- 哪些类型的程序在SQL中编写起来容易？哪些类型的程序较难？
- 您觉得声明式编程比命令式编程更容易还是更难？
- 什么是数据独立性的概念？为什么它很重要？
- 关系模型背后的关键思想是什么？它们为何优于之前的模型？关系模型在哪些方面具有限制性？
- “分层”模型（如IMS系统）与Codd提出的关系模型之间最重要的区别是什么？