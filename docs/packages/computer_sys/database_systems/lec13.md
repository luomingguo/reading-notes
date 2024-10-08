## 故障恢复的难点

- B树
  1. 逻辑插入创建不同的B树
  2. 在更新多页B-树或B-树与数据页不一致时崩溃
- 检查点成本
  - 在执行检查点操作时，我们是否必须阻塞系统？
- 恢复时间
  - 在系统再次可用之前，我们需要等待多久？
- 恢复期间崩溃
  - 在执行恢复过程中，如果系统再次崩溃，会发生什么？
- 托管更新(Escrow updates)
  - 托管更新是指某些事务可能需要保留某些资源的部分更新，在恢复过程中处理这些更新可能会非常复杂。



## 大纲

- 日志记录的黄金准则
  - 指定所有细节
- NO Force / Steal
- 可恢复的故障恢复
- 日志记录的哲学
- 低开销的checkpoint
- 支持托管更新
  - E.g., increment / decrements



## ARIES恢复方法： 3次日志遍历

- 分析： 确定需要完成的工作（前向扫描）。
- 重做阶段：确保数据库反映日志中记录但尚未写入表的更新（前向扫描）
  - 包括那些属于最终将被回滚的事务的更新！
  - 为什么？这样可以确保数据库达到“操作一致”的状态，从而允许逻辑上的撤销操作
  - 这一步被称为**“重复历史”**，因为它会重新应用已经记录的操作。
- 撤掉阶段： 回滚失败的事务（反向扫描）。

### 日志记录格式

![截屏2024-07-17 10.10.58](http://198.46.215.27:49153/i/6697283954323.png)

- LSN： 每条日志记录都有LSN
- prevLSN： 写在这个事务前面的LSN
- Undo Image/Redo Image 更新记录都有UNDO和REDO的信息
- pageLSN： 每次写入一个页面时，与该日志记录相关的最新LSN（日志序列号）会作为pageLSN包含在页面中。

### 日志记录的哲学

- REDO 是物理的。

  - 在崩溃时，数据库可能不处于“操作一致”的状态
  - 一些操作可能包含多个非原子物理操作

  ![截屏2024-07-17 10.46.17](http://198.46.215.27:49153/i/66973080bd05e.png)

  ![截屏2024-07-17 10.46.27](http://198.46.215.27:49153/i/6697308ba9ea2.png)

   X 可能在索引中反映出来了，但在表中没有反映出来，或者反过来

  - **用物理日志重放会比较容易**
    - 重放时按照日志中的顺序逐条应用即可，不需要考虑操作的依赖关系和顺序问题

- UNOD 是逻辑的。

  - 我们只需要撤销一些操作。
  - 意味着在进行 UNDO 时的状态可能与写入日志时的状态不同（可能有其他事务在此期间修改了数据库）
    - 因此，物理日志记录的具体前快照和后快照可能已经不再适用，无法直接用于撤销操作



#### 撤销的例子

![截屏2024-07-17 10.55.52](http://198.46.215.27:49153/i/669732be641de.png)

- 在序号3时刻，LSN = 3 已经写回了到页 i
- 在序号4时刻，LSN = 4 事务已经写回到页 i + 1
- 当发生crash时候，我们反向扫描进行撤销

此时会发现，当我们对T2（LSN =3 ）进行撤销时候，数据库的状态与最初日志记录时的状态不同了，因此需要逻辑撤销（B 已经移动到不同的页了）

> 为什么不需要REDO？

因为我们已经重复了历史，已经回放了所有东西。自上次操作以来对数据库进行的物理修改仍将是正确的



## ARIES 的正常操作

- 两个关键数据结构
  - 事务表 Transaction table —— 活跃事务的列表
  - 脏页表 —— 哪些已经更改但没有写回磁盘的页的列表
- 随着系统运行数据结构会更新
  - 页是异步刷回磁盘
    - 在刷新之前，日志被强制写入（但不是在写入之前）
    - 刷回不会被日志记录
  - 在commit被确认之前，日志被强制写入

### 事务表

![截屏2024-07-17 12.03.59](http://198.46.215.27:49153/i/669742b430b50.png)

- 所有活跃事务都在表上
- lastLSN: 指特定事务所写入的最新日志记录的LSN（日志序列号）

### 脏页表

![截屏2024-07-17 12.06.27](http://198.46.215.27:49153/i/6697434d6d5d6.png)

- 脏页是指已被修改但尚未写回到磁盘的数据库页， 将脏页写回到磁盘的过程称为**刷新**，刷新时从脏页表中移除相应的条目。
- recLSN: 是指第一个将该页面标记为脏页的日志记录的LSN

### 检查点checkpoints

- 会定期执行检查点，以记录当前数据库的状态
- 检查点记录包括两部分内容：脏页表的状态和事务表的状态
  - 不要求在检查点期间刷新页到磁盘
- 检查点可以帮助数据库系统在发生崩溃时限制需要重放的日志量。这样可以加快系统的恢复速度

### ARIES的例子

![截屏2024-07-17 12.10.54](http://198.46.215.27:49153/i/669744566ea69.png)

- UP：update page
- CP:  checkpoint

#### ARIES数据结构



- xactionTable
- dirtyPgTable
- Checkpoint

- Disk page

**从事务开始**

![截屏2024-07-17 12.15.23](http://198.46.215.27:49153/i/66974562acda4.png)

**执行checkpoint的变化**

![截屏2024-07-17 12.18.15](http://198.46.215.27:49153/i/6697460e5bee6.png)



**刷新后变化**

![截屏2024-07-17 12.21.05](http://198.46.215.27:49153/i/669751ebc2351.png)

1. 将脏页的对应条目移除
2. 在磁盘页上记录

**完成一个事务后**

![截屏2024-07-17 12.21.47](http://198.46.215.27:49153/i/669746e56dfdb.png)

**crash前最近的状态**

![截屏2024-07-17 12.22.18](http://198.46.215.27:49153/i/66974702f0237.png)

#### 分析阶段

主要目标是重建系统在崩溃发生时的状态，特别是恢复事务表（Transaction Table）和脏页表（Dirty Page Table）的状态

##### 正向重放日志

- **事务表的更新**：根据日志中的SOT（事务开始）、COMMIT（提交）和ABORT（回滚）记录，将事务添加到或从事务表中移除，并更新相关的事务状态。
- 对于每个页面的更新操作（UP日志记录），更新事务的lastLSN（最近日志序列号）
- 随着日志中写入操作的发生而更新脏页表。

##### 分析后的状态的分析

- 分析完成后，我们可以了解到脏页表（Dirty Page Table）和事务表（Transaction Table）的状态如何了。

- 事务表告诉我们需要撤销（UNDO）哪些操作。
- 脏页表是一个保守的列表，标记了需要重新执行（REDO）的页面。
- 为什么说它是**保守**的？
  - 因为我们实际上并不知道磁盘上的确切状态；一些页面可能已经应用了更新；前面已经提到刷新不会写入日志

> 我们从哪里开始分析？

最近一次checkpoint开始。当然你也可以从头开始，不过需要扫描很多日志

> 我们哪里找到这个checkpoint？

在磁盘上的一个已知位置保留指向检查点的指针。

##### 例子

还是回到上面的例子，我们

**从最近的检查点开始扫描**

![截屏2024-07-17 12.36.12](http://198.46.215.27:49153/i/66974a453972c.png)

**正向回放**

![截屏2024-07-17 12.37.57](http://198.46.215.27:49153/i/66974aabe4e34.png)

**扫描最后一条日志**

![截屏2024-07-17 12.39.01](http://198.46.215.27:49153/i/66974aefbd6a6.png)

- 此时活跃事务表上面的事务都是”失败“事务
- 脏页表没有反映磁盘上出正确的状态
  - **保守性**： 尽管我们不能确定所有脏页表中列出的页都需要被重放（REDO），但我们确保磁盘上的数据至少包含了所有这些LSN所记录的更新操作

#### Redo阶段

##### 从哪里开始？

- 可以从检查点开始。

- 也可以从最小的recLSN（最早未刷新的更新）开始。

##### 需要执行什么？

- 所有东西？
  - 太慢了
  - 可能会出现问题，尤其是在使用逻辑日志/托管日志
- 除非以下条件之一，否则需要重做一个更新操作：
  - **页面不在脏页表（dirtyPgTable）中**
    - 意味着该页面在崩溃前已经被写回到磁盘，并且没有再次变脏。
  - **LSN < recLSN**
    - 页面在检查点之前被刷新 & 再次变脏只可能在检查点之前
  - **LSN <= pageLSN**
    - 页面在检查点之后被刷新

<img src="http://198.46.215.27:49153/i/66974dd03a1b5.png" alt="截屏2024-07-17 12.51.22" style="zoom:67%;" />

> [!IMPORTANT]
>
> redo阶段是恢复过程中唯一需要访问磁盘的阶段，因为它需要查看页面的物理状态以决定是否需要重放操作

**REDO的条件的例子**

![截屏2024-07-17 12.58.37](http://198.46.215.27:49153/i/66974f85c684a.png)

第一个情况： A/LSN 3

第二个情况： B/LSN 2

第三个情况： C/LSN6

**将整个日志执行完**

![截屏2024-07-17 13.10.57](http://198.46.215.27:49153/i/6697526a1c15e.png)



![截屏2024-07-17 13.11.23](http://198.46.215.27:49153/i/66975285b88d6.png)

#### Undo阶段

系统会按照事务最后一个LSN的prevLSN链（前向链）的逆序顺遍历，以回滚未提交的事务（失败事务）所做的修改

> 为什么可以简单地按照prevLSN链逆序执行UNDO操作呢？

因为恢复过程中的UNDO操作实际上是在重复历史操作,只不过这次是反向操作，将数据库状态回滚到事务执行之前的状态。



![截屏2024-07-17 13.16.41](http://198.46.215.27:49153/i/669753c256c4e.png)

-----

数据库运行过程中，没有执行任何刷新（flush）操作。在第一个检查点（checkpoint1）的时候，脏页表（dirty page table）和事务表（transaction table）都是空的。

![截屏2024-07-17 13.17.40](http://198.46.215.27:49153/i/669753fa06a8a.png)

> 在崩溃发生时，表的状态必须是什么？

![截屏2024-07-17 14.12.31](http://198.46.215.27:49153/i/669760d60b7e1.png)

> 分析阶段从哪个LSN开始？

18

> 重做阶段从哪个LSN开始？

Min(recLSN) = 12

> 第一个被撤销的LSN是什么？

12



### 日志截断

- 我们必须永久保留日志吗？
- 我们将会查看日志中的最早的点是什么？
  - min（last checkpoint, min(recLSN))
- 我们可以安全的阶段任何在这之前的内容



### 补偿日志记录CLRs

Compensation Log Records，

- 在每次UNDO后写入CLR记录
- 避免重复撤销操作
- 为什么？
  - 因为UNDO是逻辑性的，我们不检查记录是否已经被撤销。如果重新撤销了某些逻辑操作，可能会出现问题。

#### 用CLR来UNDO

![截屏2024-07-17 14.22.13](http://198.46.215.27:49153/i/6697631be25fd.png)

![截屏2024-07-17 14.22.30](http://198.46.215.27:49153/i/6697632bf37c4.png)

![截屏2024-07-17 14.22.39](http://198.46.215.27:49153/i/669763384d9e7.png)



![截屏2024-07-17 14.22.53](http://198.46.215.27:49153/i/6697634500d73.png)



![截屏2024-07-17 14.23.10](http://198.46.215.27:49153/i/66976357d59f5.png)



![截屏2024-07-17 14.23.28](http://198.46.215.27:49153/i/66976369124d7.png)

![截屏2024-07-17 14.23.42](http://198.46.215.27:49153/i/66976375995a1.png)



####   使用CLR来REDO

- 在崩溃恢复时重做CLR
  - 使用REDO规则检查CLR中的更新是否完成
- 避免重复进行操作（托管）操作
  - 理CLR后，在xactionTable中更新lastLSN字段
- 允许UNDO从正确位置开始，如果我们在UNDO过程中进行检查点



## 灾难级恢复

解决方案： 复制

### 复制

- 典型方法：专用的“热备份”
  - 通过“日志传送”保持最新 - 它按照与主数据库完全相同的顺序执行日志中的操作

- 可能有多个副本，一个在本地数据中心附近，一个在更远的地方
  - ”飓风半径“
- 副本通常用于只读查询
  - 由于它们只是重放日志而不处理事务，因此具有多余的处理能力 副本故障转移

#### 故障恢复

- 在故障时，开始将查询引导到副本
- 启动新的副本
  - 使用例如每晚备份 + 日志

- 在实践中比较复杂：

  - 必须确实确定数据库失败了
    - 许多组织依赖手动故障转移

  - 需要经常测试故障转移

  - 复制负载可能会很大

