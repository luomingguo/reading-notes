# Lec4: 数据库内部

[Joseph Hellerstein and Michael Stonebraker. Architecture of a Database System]([dbs-002.dvi (berkeley.edu)](https://dsf.berkeley.edu/papers/fntdb07-architecture.pdf))

[Architecture of a Database System(中文版) (xmu.edu.cn)](https://dblab.xmu.edu.cn/wp-content/uploads/old/files/linziyu-Architecture of a Database System(Chinese Version)-ALL.pdf)

只需要阅读第1, 2章以及4.1～4.5章，这篇文章假设你已经了解一定的“lingo"数据库，当然不懂没关系，把不懂的专业术语记下来。

**我们的目标是关注整体系统设计**

![截屏2024-07-04 02.19.57](http://198.46.215.27:49153/i/6685965e16de2.png)



----

## 总览

- 进程管理器
  - 准入控制：系统是否应该立即处理该查询，或是等待系统有足够资源时再处理该查询。
  - 分发和调度器
- 客户端通信管理器
- 关系查询处理器
  - 权限检查
  - 将SQL语句编译为中间查询计划
  - 查询计划交给查询执行器
- 事务存储管理器
  - 负责所有的数据接口（读）和操作调用（建立、更新、删除），包括用于管理磁盘数据的基本算法和数据结构，比如基本的表和索引
  - 包含缓冲管理器， 用来控制内存缓冲区和磁盘之间的数据传输
  - 锁管理器确保并发运行的正确性。
  - 日志系统，确保持久性和一致性
- 共享组件和工具



## 查询处理步骤

1. 准入控制
2. 查询重写
3. 计划制定（SQL转成树）
4. 优化

### 查询重写

- 视图代换。将视图查询替换为其定义的实际查询
- 谓词转换。修改查询中的谓词（条件），使其更容易优化或更高效地执行。例如，将`OR`条件转换为`UNION`操作
- 子查询扁平化。将嵌套子查询转换为联接或其他等价的非嵌套查询

#### 视图代换

```sql
# emp: id, sal, age, dept

CREATE VIEW sals as (
	SELECT dept, AVG(sal) AS sal
  FROM emp
  GROUP BY dept
)

SELECT sal FROM sals WHERE dept = 'eecs';

# 代换为
SELECT sal FROM ( 
	SELECT dept, AVG(sal) AS sal
  FROM emp
  GROUP BY dept
) WHERE dept = 'eecs';


```

#### 谓词转换

- 删除 & 简化表达式，提升性能

- 常数简化： 如

  ```sql
  WHERE sal > 4000 + 1000 
  --->
  WHERE sal > 5000
  ```

- 移除冗余表达式

  ```sql
  a.sal > 10k and a.sal > 20k
  --->
  a.sal > 20k
  ```

#### 子查询扁平化

- 很多子查询能够被消除

  ```sql
  SELECT sal FROM (
  	SELECT dept, AVG(sal) AS sal
    FROM emp
    GROUP BY dept
  ) WHERE dept = 'eecs';
  ---->
  SELECT AVG(sal)
    FROM emp
    GROUP BY dept
  HAVING dept = 'eecs';
  ```

- 但注意不一定都能这样做

看下例子，有四个选项，将下面查询扁平化（查看机器比员工多的部门）

```sql
SELECT dept.name
FROM dept
WHERE dept.num_machines >=
 (SELECT COUNT(emp.*)
 FROM emp
 WHERE dept.name=emp.dept_name)
```

![截屏2024-07-18 02.36.48](http://198.46.215.27:49153/i/66980f45dc294.png)

答案是 **D**



### 生成计划

![截屏2024-07-18 02.42.08](http://198.46.215.27:49153/i/6698108b4517e.png)

### 查询优化

分为逻辑优化和物理优化

- 物理优化： 运算符实现和访问方法的选择（索引 vs 堆文件）
- 逻辑优化： 运算符的排序（搜索空间为指数级别）

![image-20240718024834932](http://198.46.215.27:49153/i/6698120adebb1.png)

#### Joins 和 Ordering

考虑一个嵌套循环的Join连接符号，它连接表Outers 和Inner

```python
for tuple1 in Outer
	for tuples in Inner
  	if predicate(tuple1, tuple2) then
    	emit join(tuple1, tuple2)
```

>  如果Inner本身是一个连接结果怎么办？

计划可能变成"left-deep" 或者 "bushy"

- **左深（left-deep）**：这种计划将连接操作链成一个从左到右的线性结构，意味着每个连接的结果将立即用于下一个连接操作。
- **丛状（bushy）**：这种计划允许更复杂的结构，其中某些连接结果可以并行计算，而不是线性依次进行。

## 查询执行

执行查询涉及将一系列实现查询的运算符链接在一起

运算符类型：

- 从磁盘/内存扫描  --> 需要一个数据表示模型
- 过滤记录
- 连接记录
- 聚合记录

