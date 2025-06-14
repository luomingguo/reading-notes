# Lec 4 哈希

今天的目标是关注静态查找

- 比较模型
- 直接访问数组
- 哈希
- 通用哈希
- 练习题

两个目标

> 1. 证明你不能实现比O(log n) 还快的find(k)
>
> 2. 展示如何find(k)比O(log n)还要快

## 比较模型

对于任何给定的输入，比较排序算法将首先进行某个比较，即树根的比较。根据此比较的结果，计算将继续进行其两个子节点之一的比较。算法重复进行比较，直到到达叶节点，此时算法终止，并向算法返回一个输出。对于算法的每种可能输出，必须有一个叶节点。对于搜索，有 n + 1 种可能的输出，n 个项目和未找到项目的结果，因此决策树中必须至少有 n + 1 个叶节点。然后，任何比较搜索算法必须进行的最坏情况下的比较次数将是算法决策树的高度，即从根节点到叶节点路径的最长长度



- 在这个模型中，假设算法只能通过比较来区分数据项

- 可比项目：仅支持**成对比较**的黑箱
  - 当前学的排序（插入，选择， 归并），都是比较模型

- 比较操作为 <, ≤, >, ≥, =, ≠，输出为二进制：True 或 False

- 目标：存储一组 n 个可比项目，支持 find(k) 操作

- 运行时间由执行的比较次数下界，因此要计算比较次数！



### 决策树

对于任何给定的输入，比较排序算法将首先进行某个比较，即树根的比较。根据此比较的结果，计算出，下一次进行比较的子节点。算法重复进行比较，直到到达叶节点，此时算法终止，并向算法返回一个输出。对于算法的每种可能输出，必须有一个叶节点。对于搜索，有 n + 1 种可能的输出，n 个项目和未找到项目的结果，因此决策树中必须至少有 n + 1 个叶节点。然后，任何比较搜索算法必须进行的最坏情况下的比较次数将是算法决策树的高度，即从根节点到叶节点路径的最长长度。

- **任何算法**都可以看作是执行操作的**决策树** 

- 一个内部节点表示一个二进制比较，分支为 True 或 False

- 对于比较算法，决策树是二叉的（画出示例）

- 一个叶子节点表示算法的终止，结果为算法的输出

- 从根到叶子的路径表示算法在某些输入上的执行过程

- 每个算法输出至少需要一个叶子节点，因此搜索需要≥ n + 1 个叶子节点，（n就是你存储的数据项)

### 比较搜索 的下界

- 比较搜索算法的最坏情况运行时间是多少？

- 运行时间 ≥ 比较次数 ≥ 从根到叶子的路径的最大长度 ≥ 树的高度

- 有 n 个节点的二叉树的最小高度是多少？

  - 当二叉树是完全的（除了最后一层外，所有行都满）时，最小高度h ≥ ⌈log(n + 1)⌉ - 1 = Ω(log n)，所以任何比较排序的运行时间是 $Ω(\log{n})$

  - 因此有序数组和平衡二叉搜索树通过比较模型都能支持find(k)渐进达到 $Ω(\log{n})$
  - 更普遍地，具有 Θ(n) 个叶子节点和最大分支因子 b 的树的高度是$ Ω(\log_b n)$

- 如果想要更快，需要一个允许超常数 ω(1) 分支因子的操作。怎么做到呢？

## 直接访问数组

计算机中的大多数操作只允许常数逻辑分支，比如代码中的if语句。然而，有一种操作允许非常数的分支因子：具体来说，就是在常数时间内随机访问任何内存地址的能力。这种特殊操作允许算法的决策树具有较大的分支因子，分支因子的大小仅受计算机中空间的限制。为了利用这种操作，我们定义了一种数据结构，称为直接访问数组，这是一种普通的静态数组，为每个数组索引位置关联一个语义意义：具体来说，任何具有键k的项目x都将存储在数组索引k处。这一说法仅在项目键为整数时有意义。

- 利用Word-RAM 能O(1)时间访问索引！线性的分支因子！
- 思路：给每一项一个唯一的整数键k，范围在{0,...u-1}之间，将项存储在数组的索引k处
- 与数组的每个索引关联一个含义，如果键可以适应一个机器字，即$u \le 2^w$，则在最坏情况下O(1)的查找/动态操作！
- 这门课，假设输入的数字/字符串都可以适应一个字，除非长度有明确参数化
- 计算机内存中的任何内容都是二进制整数，或使用（静态）64位内存地址
- 但空间复杂度是 O(u)，所以如果 $n << u$​，就会很糟糕... :(
  - 例如如果键是10个字母，每个名字占一位，则需要$26^{10} \approx 17.6TB$
  - 如何使用更少的空间呢？
  - 答案： Hashing

## Hashing

- 想法！如果 n << u，将键映射到一个较小的范围 m = Θ(n) 并使用较小的直接访问数组

- 哈希函数：h(k) : {0, ..., u - 1} → {0, ..., m - 1}（也称为哈希映射）

- 直接访问数组称为哈希表，h(k) 称为键 k 的哈希值

- 如果 m << u，根据鸽笼原理，没有哈希函数是单射的

- 总是存在键 a 和 b 使得 h(a) = h(b) → 冲突！ :(

- 不能将两个项存储在同一个索引处，所以应该存储在哪里？有两种选择：

  - 存储在数组的其他地方（开放寻址）
    - 分析复杂，但常见且实用

  - 存储在另一个支持动态集合接口的数据结构中（链表法）

### 链表法

- 想法！将冲突存储在另一个数据结构（链表）中
- 如果键大致均匀地分布在索引上，链表大小为 n/m = n/Ω(n) = O(1)！
- 如果链表大小为 O(1)，则所有操作都需要 O(1) 时间！太好了！
- 如果不均匀，很多项可能映射到同一个位置，例如 h(k) = 常数，链表大小为 Θ(n) :(
- 需要一个好的哈希函数！那么什么是好的哈希函数呢？

### 哈希函数

Division Method(bad)：h(k) = (k mod m)

- 这是启发式方法，当键均匀分布时效果好！
- m 应该避免存储键的对称性
- 远离 2 和 10 次幂的大质数可以是合理的选择
- Python 使用一种带有额外混合的版本
- 如果 u >> n，每个哈希函数都会有一些输入集会产生 O(n) 大小的链表
- 想法！不要使用固定的哈希函数！随机选择一个（但要谨慎）！

## 通用哈希

Universal 哈希函数：$h_{ab}(k) = (((ak + b) \text{ mod } p) \text{ mod } m)$

- 哈希家族$\mathcal{H}(p, m) =  \{ h_{ab} \mid a, b \in \{0, \ldots, p - 1\} \text{ 且 } a \ne 0 \} $

- 参数由一个大于 u 的固定质数 p 以及从范围 $\set{0, ..., p - 1}$​​​ 中选择的 a 和 b 构成
  - 通过选择具体的 a 和 b 值可以指定该族中的单个哈希函数
- $\mathcal{H}$是通用家族：$Pr_{h\in \mathcal{H}}\set{h(k_i) =h(k_j)}\le 1/m\ \text{,}\forall k_i \neq k_j \in \set{0,...u-1}$ 
- 为什么通用性有用？这意味着短链表长度(O(1)) ！（期望情况下）
- $X_{ij}$ 是   h ∈ H 上的指示随机变量：如果 $h(k_i) = h(k_j)$，则 $X_{ij}$ = 1，否则 $X_{ij}$= 0
- 索引 $h(k_i)$ 处链表的大小是随机变量 $h(k_i)= X_i = \sum_j{ X_{ij}}$

- 索引$h(k_i)$处链表大小的期望值为  

$$
\mathbb{E}_{h\in \mathcal{H}} \{X_i\} &=\mathbb{E}_{h\in \mathcal{H}} \set { \sum_{j} X_{ij}  } = \sum_{j} \mathbb{E}_{h\in \mathcal{H}}\{X_{ij}\} = 1 + \sum_{j \neq i} \mathbb{E}_{h\in \mathcal{H}}\{X_{ij}\} \\
         &= 1 + \sum_{j \neq i} \left( 1 \cdot \Pr\{h(k_i) = h(k_j)\} + 0 \cdot \Pr \{h(k_i) \neq h(k_j)\} \right) \\
         &\leq 1 + \sum_{j \neq i} \frac{1}{m} \\
         &= 1 + \frac{n - 1}{m}
$$

- 由于 m = Ω(n)，负载因子 α = n/m = O(1)，所以期望情况下是 O(1)！
- 注意，为了保持m = O(n)，插入和删除操作可能需要重新构建不同大小的直接访问数组，选择新的哈希函数，并将所有项重新插入到哈希表中。这可以像动态数组那样进行，从而为动态操作提供摊销界限。

### 动态性

- 如果$n/m$ 远离1， 使用新的随机选择的哈希函数重新构建大小为m的哈希表
- 与动态数组分析，成本可以分摊到许多动态操作上
- 因此，哈希表在期望分摊O(1)时间内实现动态集合操作！ :)

## 练习题