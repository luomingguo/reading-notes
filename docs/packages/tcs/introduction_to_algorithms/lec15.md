# lec 15 动态规划, Part1: SRTBOT

## 总览

- 复习

- SRTBOT——递归算法范式
- DP $\approx$ 递归 + 备忘录(memoization)
  - 通过猜得出子问题的解
  - 从底向上
- Example 
  - Fibonacci问题
  - DAG最短路径问题
  - 保龄球得分问题 

## 复习

>  如何解决一个算法问题

1. 将问题规约到你已经熟悉的问题上（用数据结构或者算法）

| 搜索数据结构 | 排序算法 | 图算法              |
| ------------ | -------- | ------------------- |
| 列表         | 插入排序 | BFS                 |
| 链表         | 选择排序 | DAG松弛（DFS+Topo） |
| 动态数组     | 归并排序 | Dijkstra            |
| 直接访问数组 | 计数排序 | Bellman-Ford        |
| 哈希表       | 基数排序 | Johnson             |
| AVL树        | 堆排序   |                     |
| 二叉堆       |          |                     |

2. 设计你自己的递归算法

   1. 固定大小的程序解决任意输入
   2. 需要循环或递归，通过归纳分析
   3. 递归函数调用：图中的顶点，如果B调用A，则从A → B有有向边
   4. 递归调用的依赖图必须是无环的（如果能终止）
   5. 根据图的形状分类

   | 类型      | 图                   |
   | --------- | -------------------- |
   | 暴力解法  | 星型（枚举所有可能） |
   | 减而治之  | 链                   |
   | 分而治之  | 树                   |
   | 动态规划  | DAG                  |
   | 贪心/增量 | 子图                 |




## 动态规划

动态规划（Dynamic Programming ）在子问题依赖形成有向无环图而不是树的情况下，推广了分治类型的递归。动态规划通常应用于优化问题，在这些问题中，您要最大化或最小化一个标量值，或者计数问题，在这些问题中，您需要计数所有可能性。

### SRTBOT——递归算法范式

**如何用递归解决问题**（SRTBOT)，最困难的方法是构建子问题上的递归。

1. **Subproblem** definition.  定义子问题 $x \in X$
   - 用参数的角度描述子问题的含义
   - 比如输入的子集：前缀、后缀，连续子序列
   - 比如记录部分状态：通过递增一些辅助变量来添加子问题
2. **Relate** subproblem solutions recursively.关联子问题
   - 比如$x(i) = f(x(j), ...) \text{for one or more j < i}$
3. **Topological order** on subproblems(=> subproblem DAG). 论证关联关系是无环的，并且子问题构成了一个DAG
4. **Base** cases of relation 关系基本情况
5. **Original** problem solution via subproblem(s) 
   - 展示如何从子问题的解中计算原始问题的解
   - 可能使用父指针来恢复实际解，而不仅仅是目标函数。
6. **Time** Analysis
   - $\sum_{x\in X} work(x)$, 或者如果$work(x) = O(W)$ 对于所有 $x \in X$成立，那么|X|·O(W)
   - work(x) 衡量关系中的非递归部分，将递归视为O(1)的时间



### 实现

一旦选择了子问题并找到依赖关系的有向无环图（DAG），解决问题有两种主要方法，这两种方法在功能上是等效的，但实现方式不同。

- **自顶向下的方法**从根节点（没有入边的顶点）开始评估递归。在每次递归调用结束时，将计算出的子问题的解记录到备忘录中，而在每次递归调用开始时，检查备忘录以查看该子问题是否已被解决。
- **自底向上的方法**根据子问题依赖的有向无环图的拓扑排序顺序计算每个子问题，同时记录每个子问题的解，以便用于解决后续子问题。

通常，子问题的构造使得拓扑排序顺序是显而易见的，特别是当子问题仅依赖于参数较小的子问题时，因此执行深度优先搜索（DFS）以找到这种顺序通常是没有必要的。自顶向下是一种递归视图，而自底向上则展开了递归。这两种实现都是有效的，且经常被使用。两种实现都使用备忘录来记住先前子问题的计算。虽然通常会备忘所有已评估的子问题，但在子问题按“轮次”出现时，记住（备忘）更少的子问题通常是可能的

## 示例： 归并排序

对大小为n的数组A进行归并排序Merge_Sort(A)，用SRTBOT的表达如下：

- **S**ubproblem: $S(i, j) = \text{sorted array on elements of } A[i:j]  \text{ for } 0\le i\le j \le n$

- **R**elation: $S(i, j) = merge(S(i, m), S(m, j));\text{其中}  m = ⎣ (i+j) / 2⎦$

- **T**opo order: 子数组的长度，不断增加（即$j - i$不断增大）

- **B**ase case: S(i, i) = []

- **O**riginal problem: S(0, n)

- **T**Ime: $T(n) = 2T(n/2) + O(n) = O(nlgn); n = j - i$

在这个例子中，子问题DAG是一棵树(用分治法)



## 示例： 斐波那契数列

Fibonacci numbers: given n, compute $F(n) = F(n-1) + F(n-2), F(1) = F(2) = 1$

- Suburbs: $F(i)$ , $ 1 <= i <= n $

- Relate: $F(i) = F(i-1) + F(i-2)$

- Topo order:  增长i， for i = 1, 2, ..., n
- Base case: $F(1) = F(2) = 1$
- Orignial: $F(n)$
- Time: $T(n) = T(n-1) + T(n-2) + 1,  F(n)$指数增长

### 复用子问题解

**思路： Memoization备忘录**

- 记录和复用子问题的解
  - 通过维护一个map，子问题规模 --> 解

- 两个方法
  - 至顶向下： 记录子问题的解并记录
  - 至底向上： 通过拓扑顺序排序的顺序解除子问题

- 对于Fibonacci， n+1个子问题（顶点）以及 小于2n个依赖（边）
- 每个F(i)都需要做一次加法，因此，总的时间复杂度是O(n)

```python
# 递归解（至顶向下）
def fib(n):
  memo = []
  def F(i):
    if i < 2: return i
  	if i not in memo:
      	memo[i] = F(i-1) + F(i-2)
    return memo[i]
  return F(n)
```

```python
# 递归解（至底向上）
def fib(n):
  F = {}
  F[0], F[1] = 0, 1
  for i in range(2, n+1):
    F[i] = F[i-1] + F[i-2]
  return F[n]
```

- 一个潜在的问题是，Fib数可能增长到$\theta(n)$​位这么长，也就是说>> 机器字长w，也就是说需要多个字来表示一个数字。
  - 这样一来加法操作需要分成多次按位加法来完成，每次加法的时间复杂度是$O(⌈n/w⌉)$

- 非递归次数 *（标准加法 + 额外位操作） = 总的时间复杂度为$O(n + n^2 / w)$ 

总的来说：

- 如果数值较小（在机器的字长 w 范围内），则时间复杂度主要由迭代次数 n 决定，即O(n)
- 如果斐波那契数值很大，每次加法需要按位操作，导致计算时间变为 $O(n + n^2 / w)$ 

## 示例：DAG最短路径问题

DAG SSSP（单源最短路径）问题: 给定一个DAG 和 源顶点s， 计算𝛿(s, v) for all v ∊ V

- **S**ubproblems: 𝛿(s, v) for each v ∊ V

- **R**elate: $𝛿(s, v) = \min \set{𝛿(s, u) + w(u, v) | u ∊ Adj^-(v) }  ∪ \set{∞}$​
  - 如果没有前驱节点，则路径长度为无穷大

- **T**opo order：图G的拓扑排序

- **B**ase case: $𝛿(s, s) = 0$

- **O**riginal: 𝛿(s, v) for all v ∊ V

- **T**ime: $\sum_{v\in V}O(1 + |Adj^-(v)|) = O(|V| + |E|)$​
  - 每个顶点 vvv 的计算时间与其前驱顶点数量相关

DAG 最短路径问题也可以通过 **边松弛算法** 来求解。松弛算法的思想是：

- 这个过程是从边的起点 u 出发，检查所有指向 u 的边是否可以通过更新来找到更短路径。
- 边松弛的过程是逐步完成的，与动态规划的思想本质上是相同的，都是通过前驱节点的信息来更新当前节点的最短路径值

动态规划的计算可以理解为从顶点v的前驱集合$Adj^-(v)$的角度出发，而边松弛算法则从顶点u的后继集合$Adj^+(u)$的角度出发，两者的结果相同。

## 示例： 保龄球得分问题

保龄球例子： 给定n个保龄球，0, 1, ... , n-1

- 保龄球 ``i ``有一个值 $v_i$
- 撞倒一个保龄球``i``，会获得$v_i$分
- 撞到2个保龄球``i``和``i+1``，你将得到$v_i * v_{i+1}$分
- 问题： 投掷0次或多次，使得目标是得到最大的分数
- ![image-20240924102459539](http://14.103.135.111:49153/i/66f223025b56d.png)

### 基于分治算法的SRTBOT框架分析

- Subproblems: B(i, j) = 从第i, i + 1 ... j - 1个保龄球最大总得分
- Relation:
  - $ m = ⎣ (i+j) / 2⎦$​
  - 要么m和m+1同时被击中，要么没有
  - $B(i, j) = \max \set{v_m·v_{m+1} + B(i,m)+B(m+2, j), B(i,m+1) + B(m+1,  j)}$
- Topo order: 使 ``j-i``增长
- Base Case: $B(i,i) = 0, B(i, i+1) = max \set{v_i, 0}$
- Original: B(0, n)
- Time = $T(n) = 4T(n/2) + O(1) = O(n^2)$

这个算法效率不是太高，也不够通用，但是通过简单的改造实现同时击中3个球的情况



### 基于后缀的SRTBOT框架分析

- **S**ubprobs: B(i) = max score possible with starting pins $i, i+1, ..., n-1$, for $0 \le i \le n$

- **R**elate: 
  - 暴力解法： 对于第一个保龄球，要么跳过，要么被单独击中，要么被连带击中
  - 规约到更小的后缀和，要么是B(i+1) 或者是 B(i+2)
  - $B(i) = \max \{{B(i+1), B(i+1) + v_i, B(i+2) + v_{i} * v_{i+1}}\}$ 

- **T**opo: decreasing i for i = n, n-1, ..., 0

- **B**ase: B(n) = B(n+1) = 0

- **O**riginal: B(0)

- **T**ime: θ(n) = θ(1) work * θ(n)  #subprobs 

![image-20240924102955019](http://14.103.135.111:49153/i/66f224262548f.png)

```python
# Bottom-up (iterative solution)
def bowl(v):
  B = {}
  B[len(v)] = 0
  B[len(v) + 1] = 0
  for i in reversed(range(len(v))):
		B[i] = max(B[i+1], v[i] + B[i+1], v[i] * v[i+1] + B[i+2])
  return B[0]

# Top-down (recursive down)
def bowl(v):
  memo = {}
  def B(i):
    if i >= len(v): return 0
  	if i not in memo:
      memo[i] = max(B(i+1), v[i] + B(i+1), v[i] * v[i+1] + B(i+2))
    return memo[i]
 	return B(0)
```





## 练习题

> 简化版二十一点（Blackjack）
>
> 我们定义一种简化的二十一点游戏，玩家与庄家之间进行。牌堆是一个包含 n 张牌的有序序列 $D = (c_1, . . . , c_n)$，其中每张牌 $c_i$ 是 1 到 10 之间的整数（与真实的二十一点不同，A 始终被视为 1 点）。二十一点是以轮次进行的。在每一轮中，庄家将从牌堆中抽取前两张牌（最初为 c1 和 c2），然后玩家将抽取接下来的两张牌（最初为 c3 和 c4），之后玩家可以选择是否再抽一张牌（称为“加牌”）。
>
> 如果玩家的手牌（即本轮玩家抽取的牌的总和）的值 ≤ 21 并且超过庄家的手牌值，则玩家赢得这一轮；否则，玩家输掉这一轮。当牌堆中剩余的牌少于 5 张时，游戏结束。
>
> 给定一个已知顺序的 n 张牌的牌堆，描述一个 O(n) 时间复杂度的算法，以确定玩家通过与庄家进行简化二十一点游戏可以赢得的最大轮数。





> 文本对齐
>
> 文本对齐是将一系列 n 个用空格分隔的单词放入固定宽度 s 的列中，以最小化单词之间的空白量的问题。每个单词可以用其宽度 \(w_i < s\) 表示。最小化一行的空白量的一个好方法是最小化该行的“坏度”。假设一行包含从 \(w_i\) 到 \(w_j\) 的单词，该行的坏度定义为：
>
> $$
> b(i, j) = 
> \begin{cases} 
> (s - (w_i + \ldots + w_j))^3 & \text{如果 } s > (w_i + \ldots + w_j) \\ 
> \infty & \text{否则} 
> \end{cases}
> $$
> 良好的文本对齐应该将单词分成多行，以最小化包含单词的所有行的坏度总和。立方权重会对行中的大空白量进行严重惩罚。Microsoft Word 使用贪婪算法来对齐文本，该算法在移动到下一行之前，尽可能多地将单词放入一行。这种算法可能导致一些非常糟糕的行。相反，LATEX 使用动态规划格式化文本，以最小化这种空白量度量。
>
> 描述一个 \(O(n^2)\) 的算法，将 n 个单词适配到宽度为 s 的列中，以最小化所有行的坏度总和。

# Lec 16 动态规划, Part2: LCS, LIS, Coins



## 总览

- 最长公共子串(LCS，Longest Common Subsequence)
- 最长增长子串(LIS，Longest Increasing Subsequence )
- 交替硬币游戏(Alternating coin game)



## 最长公共子串（LCS）



给定两个系列A & B，找到最大的公共子串（无需要连续）

Ex： Hieroglyphology 和 Michelangelo，其LCS为 hello 或者是 heglo 或 iello 或者ieglo，长度都是5

- **S**ubproblem

  - $L(i, j) = LCS(A[i:], B[j:]) \text{ for }0 <= i <= | A |, 0 <= j <= |B|$

- **R**elate: 

  - 首字母要么匹配，要么不匹配

  - 如果首字母匹配，则某个LCS会使用它们

  - 如果某个 LCS 使用了 A[i] 的第一个字符，而没有使用 B[j] 的第一个字符，匹配 B[j] 也是最优的

  - 如果它们不匹配，它们不能同时出现在最长公共子序列中

    **猜测**A[i]和B[j]其中有一个不在LCS中
    $$
    L(i, j) = 
    \begin{cases}
    L(i+1, j+1) + 1 \text{  if A[i] = B[j]} \\
    \max \set{L(i+1, j), L(i, j+1)}  \text{  其他}
    \end{cases}
    $$

- **T**opo

  - 逐步减小 ``i+j``
  - 可以通过bottom-up方法： 先减小``i``，再减小``j``

- **B**ase
  - $ L(|A|, j) = 0 = L( i, |B| )$ （其中有一个字符串为空）
- **O**riginal
  - 最长公共子序列为L(0, 0)
  - 保存父指针用于重构序列
  - 如果父指针同时增加索引值，则将该字符添加到LCS中
- **T**ime
  - 子问题数目： (|A| + 1) · (|B| + 1)
  - 每个子问题的工作量：O(1)
  - 总共的运行时间 $O(|A|·|B|)$​



**LCS 子问题 DAG**

![截屏2024-06-15 13.51.58](http://14.103.135.111:49153/i/666d5b886cbe8.png)

（边缘的是Base case， 每个节点都是一个子问题，对应于什么是最长公共子序列，比如（3，2）这个点而言， 子问题就是EIR和ABIT的LCS是什么？箭头是父指针）



```python
def lcs(A, B):
  a, b = len(A), len(B)
  x = [[0] * (b+1) for _ in range (a+1)]
  for i in reversed(range(a)):
    for j in reversed(range(b)):
      if A[i] == B[j]:
        x[i][j] = x[i+1][j+1] + 1
      else:
        x[i][j] = max(x[i+1][j], x[i][j+1])
  return x[0][0]
```







## 最长增长子序列（LIS）

问题描述： 给定长度为n的序列A，找到一条最长（可不连续）字母严格递增的子序列，即LIS(A)

Ex: CARBOHYDRATE ==> ABORT

尝试的解决方案：

- 子问题自然是A的前缀或者后缀，以后缀为例A[i:]
- 一个很自然的的问题是A[i]是否在LIS中？（需要进行分支）
- 但是，如何在A[i+1:]上递归并保证是递增子序列呢？
- 修正：给子问题添加**约束**，提供足够的结构来实现递增性



SRTBOT分析：

- **S**ubprobs
  - 令L(i) = 后缀$A[i:]$最大递增子序列的长度，即$LIS(A[i:])$，其中 $0\le i \le |A|$
  - 约束: 以A[i]为开始（也就是说A[i]在最大递增子序列里面）
- **R**elate
  - 已知第一个元素是A[i]，那么第二个元素是哪个呢？
    - 可以是任何$A[j]\text{，其中} j  > i \text{ 且 } A[j] > A[i]$ ，
    - 也可能A[i]是LIS最后一个元素
  - $L(i) = 1 + \max \set{L(j) | i < j < n, A[i] < A[j]} ∪ \set{0} $
  - 错误的思路： 我们思考i是不是在LIS当中，在和不在分别讨论。第一反应是L(i) =  max{L(i+1), 1+L(i+1)}， 因为这是子问题约束的关系
- **T**opo order
  - for  i = |A|, ..., 0
- **B**ase:
  - 无需，因为我们考虑的就是A[i]就是最后一个LIS元素
- **O**riginal: 
  - 那个是LIS的第一个元素呢？ **靠猜**
  - 我们LIS(A)的长度为$ \max \set{L(i) | 0\le i\le|A|}$
  - 需要存储子问题父指针来重构序列
- **T**ime: 
  - 子问题个数： θ(|A|) 
  - 每个子问题的工作量： O(|A|)
  - 总的时间复杂度：$O(|A|^2)$ 

> 练习题：  加速到$O(|A|\log{|A|})$完成，通过将每个子问题的工作量减到$O(\log{|A|})$ ，提示AVL增强树

我们用了两次暴力解法， 一个是求以i为开头的的LIS，第二个是，我们选择了j暴力尝试所有可能。

**LIS子问题的DAG图**

![截屏2024-06-16 16.17.50](http://14.103.135.111:49153/i/666e9fbdbde9f.png)



```python
def lis(A):
  a = len(A)
  l = [1] * a
  for i in reversed(range(a)):
    for j in range(i, a):
      if A[j] > A[i]:
        x[i] = max(x[i], 1+x[j])
  return max(x)
```





## 交替硬币游戏

给定一系列n个硬币，其价值为 $v_0, ... v_{n-1}$​，两个玩家轮流拿硬币，每轮可以从剩下的硬币中取第一个或者最后一个硬币，我的目标最大化我拿到的硬币总价值，我先开始。

### 方案一： 子问题扩展

子问题扩展， subproblem expansion的SRTBOT分析：

- **S**ubprobs:   $X(i, j, p)$ = 我能在 $v_i, .... , v_j$拿到的最高值硬币, p代表是你还是我
- **R**elate:  
  - 玩家p必须选择 第$i$ 个或者 $j$ 个硬币（需要猜！）
  - 如果p=me， 那么我将得到那个值，否则什么都没得到
  - 然后轮到另外一个玩家
  - $X(i, j, me) = \max \set{X(i+1, j, u) + v_i, X(i, j-1, u) + v_j}$
  - $X(i, j , u) = \min \set{X(i+1, j, me), X(i, j-1, me)}$
- **T**opo:  增大  ``j-i``
- **B**ase: 
  - $X(i, i, me) = v_i $
  - $X(i, i, u) = 0$
- Original problems:
  -  $X(0, n-1, me)$
  - 保存父指针来重构策略
- **T**ime analysis: 
  - 子问题个数： $\Theta(n^2)$
  - 每个子问题的工作量: $\Theta(1)$
  - 总共时间复杂度: $\Theta(n^2)$

**子问题DAG**

![截屏2024-06-16 16.54.13](http://14.103.135.111:49153/i/666ea842acaff.png)

以上，叫**子问题扩展**





### 方案二： 零和博弈

零和博弈：我拿走所有你不拿的硬币，没有合作关系

- **S**ubproblems:
  - $x(i, j) = $我能拿到的最大分数，在基于硬币$v_i, ...,v_j$的情况下
  - 其中 $0\le i \le j \lt n$
- **R**elate
  - 我必须选择要么是第 i 个 要么是第 j 个
  - 因此，你能够获得 $x(i+1, j)$或者$x(i, j-1)$，分别对应于我选择硬币i或j
  - 为了计算我能获得的价值，从总硬币值中减去这一部分
  - $x(i, j) = \max \set{v_i + \sum^j_{k=i+1} v_k - x(i+1, j), v_j+\sum_{k=i}^{j-1}v_k-x(x, j-1)}$
- **T**opo order
  - 逐步增大 ``j-i``
- **B**ase
  - $x(i, i) = v_i$
- **O**riginal
  - $x(0, n-1)$
  - 存储父指针
- **T**ime Analysis
  - 子问题数目 $\Theta(n^2)$
  - 每个子问题的工作量 $\Theta(n) $，计算总和
  - 运行时间为 $\Theta(n^3)$​

**子问题DAG**

![截屏2024-06-16 16.54.46](http://14.103.135.111:49153/i/666ea862d10b2.png)

> 练习题： 将复杂度提升到$\Theta(n^2)$，通过以$\Theta(n^2)$时间内预处理所有和\sum^j_{k=i}v_k$



# Lec 17 动态规划, Part 3: ASPS, Parens, Piano

## 总览

- Bellman-Ford SSSP
- Flayd-Wallshall APSP
- 算术括号问题
- 钢琴指法问题



## 单源最短路径：Bellman-Ford 算法

SRTBOT分析：

- Subproblems
  - 扩展子问题，使其无环
  - $\delta_k(s, v) = $ 从 s 到 v 的最短路径权重， 最多使用 k 条边
  - for $v ∊V $ & $ 0 <= k <= |V| $

- Relate

  - $𝛿\_k(s, v) = \min \set{𝛿\_{k-1}(s, u) + w(u, v) | u ∊ Adj(v) } ∪ {𝛿_{k-1}(s, u)}$

  - guessing "lost edge(u, v) on shortest s->v path"

观察到，𝛿\_k(s, v) = 𝛿\_{k-1}(s, u) + w(u, v)，这个递归不存在循环。如果随着k增长，都是满足上述等式，

- Topological order: increasing k

Topo order of G 

- Base case: 𝛿_{0}(s, s) = 0 , 𝛿\_{0}(s, v) = ∞ for v ≠ s

- Original: 𝛿\_{|v| -1}(s, v) for v ∊ V: 𝛿\_{|v|}(s,v) for neg-weight cycle detection 

- Time: 
  - 子问题数目：$|V| \times (|V| + 1)$
  - 每个子问题的工作量$\delta_k(s, v): O(deg_{in}(v))$
  - 总的时间：$\sum^{|V|}_{k=0}\sum_{v \in V}O(|deg_{in}(v)|) = \sum^{|V|}_{k=0}O(|E|) = O(|V|·|E|)$

 

## 全源最短路径: Floyd-Warshall 算法 

弗洛伊德演算法。

顶点标上序号1, 2, ... |V|

- subprobs: d(u, v, k) = u->v最短路径的权重，其中仅用到在集合{u, v} ∪ {1, 2, ...,k}的顶点 for  u, v ∊ V & 0 <= k <= |V|,  θ(|V|^3)

- Relate: d(u, v, k) = min{d(u, v, k-1), d(u, k, k-1) + d(k, v, k-1)}

  - u --(1,...,k-1)---> v (第一种情况，不需要使用k).即 k ∉SP
  - u --(k-1)--->k, k ---(k-1)--->v, 即 k ∊SP

- topo: increasing k, for k = 0, 1, ... |v|  for u ∉ V for v ∊V

- Base: S(u, v, 0) = 

  1. 0 if u = v ; 
  2. w(u,v) if (u, v) ∊ E
  3. ∞ otherwise

  并且假设没有负权重环

- Orignial

- Time: ｜V｜ = θ(|E|^2) => θ(|V|^3)

  - 对比dijkstra θ（｜V|lg|V| + |V|*|E|, |V| = θ(|E|) => θ(|V|^2lg|V|)

## 算术括号问题



## 钢琴指法问题

问题描述：

给定序列$t_0, t_1, ...t_{n-1}$ 单音符，用右手弹奏，右手手指分别是1,2，...，f，给定过渡从音符t及其手指f，到音符t'及其手指f'的难度度量$d(t, f, t', f')$

- 如果$ 1 \lt f \lt f' $ 且 $t > t'$，则是不舒适的
- 连续（平滑）演奏要求 $t = t'$ （否则罚分是无限大）
- 弱指规则，尽量避免使用 $f' \in \set{4, 5}$
- $\set{f, f'} = \set{3, 4}$ 是令人烦恼的

目标： 为音符分配手指，以最小化总难度

**第一次尝试SRTBOT分析：**

- Subproblem
  - x(i) = 最小化的演奏难度分，弹奏音符为$t_i, t_{i+1}, ..., t_{n-1}$

- Relate
  - 猜测第一个手指， 给$t_i$ 分配 f 手指
  - $x(i) = \min \set {x(i+1) + d(t_i, f, t_{i+1}, ?) | 1 \le f \le F}$
  - 没有足够的信息来填写 ？ 
  - 问题
    - 需要知道在开始$x(i+1)$时使用哪个手指
    - 不同的起始手指可能会影响 $x(i + 1)$ 和 $d(t_i, f, t_{i+1}, ?)$​ 的结果
  - 解决方案
    - 需要一个表来映射起始手指到$x(i+1)$的最优解
    - 也就是说，需要通过起始条件来扩展子问题

**最终解决方案SRTBOT分析**：

- Subproblem
  - $x(i, f)$ 最小化的演奏难度分，弹奏音符为$t_i, t_{i+1}, ..., t_{n-1}$，并且手指f在字符$t_i$
  - For $ 0 \le i \lt n $ 且 $1 \le f \le F$
- Relate
  - 猜测下个手指： 将 f' 分配给 $t_{i+1}$
  - $x(i, f) = \min \set{x(i+1, f') + d(t_i, f, t_{i+1}, f') | 1 \le f' \le F}$
- 拓扑顺序
  - 逐步减小 i （任何 f 顺序）

- Base
  - $x(n-1, f) = 0 $ 没有转换
- Original
  - $\min \set{x(0, f) | 1\le f \le F}$
- Time
  - Θ(n · F) subproblems 
  - Θ(F) work per subproblem 
  - $Θ(n · F^2)$

# Lec 18 动态规划, Part 4: 切割



## 总览

- 整数子问题
- 伪多项式时间
- 例子
  - 切割杆问题
  - 子集求和问题 
- DP特性复习



## 切割杆问题

- 给定一个长度为L的杆，和不同长度$\mathcal{l}$的杆的价值v($\mathcal{l}$), $\mathcal{l} \in \set{{1,2,...L}}$

- 目标：切割杆最大化切割杆价值
- Ex: L = 7, v = [0, 1, 10, 13, 18, 20, 31,32]
- 贪心算法能获得最大价值吗？
  - 不一定！

SRTBOT分析：

1. 子问题： $x(\mathcal{l})$: 切割长度$\mathcal{l}$的杆能获得的最大价值，对于$\mathcal{l} \in \set{0, 1, ..L}$成立

2. 递归关联子问题解：

   - 第一块为长度p（猜的！）
   - $x(\mathcal{l}) = max \set{v(p) + x(l-p) | p \in \set{1..., \mathcal{l}}}$​

3. 拓扑顺序

   - 对$\mathcal{l}$增长： 子问题$x(\mathcal{l})$仅仅取决于严格递减的$\mathcal{l}$，所以不会成环。for $\mathcal{l}$​​ = 0, 1..., L

   - 子问题的DAG
     ![截屏2024-08-08 06.17.30](http://14.103.135.111:49153/i/66b3f28aaf6e7.png)

     

4. 基本情况

   - x(0) = 0 

5. 原始问题：

   - 长度为L的切割杆的最大价值是x(L)

6. 时间分析

   - 子问题数量： L+1
   - 每个子问题的工作量： O($\mathcal{l}$) = O(L)
   - O($L^2$) 运行时间

$\Theta({L^2})$这是一个多项式时间吗？

- （强）多项式时间是指，运行时间被输入大小的常数次数多项式所界定，而输入大小以word（字数）计算（这里例子中，因此这些数字都可以在机器字中存储）
- •在杆切割问题中，输入大小是 L + 1 字（一个整数 L 和 在价值函数 v 的 L 个整数 ） 
- O(L²) 是 L + 1 的常数次数多项式，因此答案是：是的，（强）多项式时间



## 子集求和

- 输入： n个正整数序列$ A = \set{a_0, a_1, ..., a_{n-1}}$
- 输出： 是否在存在A的子集，使其求和恰好等于T？即是否存在A的子集A'，使得$\sum_{a\in A'}a = T$？
- Ex： A = (1, 3, 4, 12, 19, 21, 22), T = 47， 可以找到子集 A' = {3, 4, 19, 21}
- 这是个优化问题？ 
  - 不是，这是一个决策问题。答案是YES or NO， Ture or False，而不是求最大值最小值这类优化问题。

**SRTBOT分析**

1. 子问题:

   - $x(i, t)$ = A[i:]的子集求和为t
   - $i \in \set{0, 1, ...n}$, $t \in \set{0,1, ...T}$​

2. 递归关联子问题解：

   - 思路：第一项$a_i$ 是否在A合法子集S内（Guess！）
   - 如果是，用剩余项尝试求和成$t - a_i$ 
   - 如果不是，用剩余项尝试求和成t
   - $x(i, t) = \begin{cases} x(i+1, t-a_i) \text{ if } a_i\le t   \leftarrow a_i \in S \\ x(i+1, t) ，其他情况 \leftarrow a_i \notin S \end{cases}$​

3. 拓扑顺序

   - 子问题x(i, t)仅仅依赖更大索引的子问题x(i+1, t)或者x(i+1, t-A[i])
   - 解决问题可以按照i严格递减的顺序（即从大到小）

4. 基本情况

   - $x(n, t) = \begin{cases} Yes \text{ if t = 0} \\ No \text{ if } t \neq 0 \end{cases}$​

5. 原始问题

   - x(0, T)

   - 解决所有子问题的DGA

     - 至底向上

       ![截屏2024-08-08 10.29.00](http://14.103.135.111:49153/i/66b42d75ce38b.png)

     - 至顶向下

       ![截屏2024-08-08 10.29.11](http://14.103.135.111:49153/i/66b42d816e480.png)

6. 时间分析

   - 子问题数目O(nT)， 每个子问题工作量为O(1)，因此需要O(nT)时间 

这是多项式时间吗？

- 输入大小n+1：整数T和A里面的n个整数 
- O(nT)被n+1的多项式界定吗？ 
  - n和T的关系未知，T可能是n，n^2
  - 在w-bit的Word-RAM 模型， 已知$ T \le 2^w$，$w\ge \log{n}$，但是可能w >> log n，我们并不知道w的上界
    - e.g. w=n 也是不合理的，运行时间就成了$O(n2^n)$, 这是指数级的

## 伪多项式

- 算法的伪多项式时间：运行时间上界由输入大小和输入整数的常次数多项式界定
- 如果整数在输入大小上是多项式有界的，即$n^{O(1)}$（与基数排序在 $O(n)$​ 时间内运行的情况相同），那么这种算法在这种情况下是多项式的
- 计数排序O(n+u)，基数排序$O(n\log_n{u})$，直接访问数组构建O(n+u)，斐波那契O(n)都是伪多项式算法
- 计数排序是弱多项式（基于强多项式和伪多项式之间的概念）： 在以位数测量的输入大小（即输入整数的对数）上界由常数次多项式界定
- 与切割杆问题相比，它是多项式的
  - 对L有伪多项式以来
  - 但幸运的是也有L个输入整数
  - 如果仅给出可销售杆长度的子集（背包问题，它推广了杆切割和子集和问题——见课堂讨论），那么算法将仅是伪多项式的



### 复杂度

- 当整数不是多项式有界时，子集和问题可以在多项式时间内解决吗？
- 如果 P ≠ NP，则不行。那是什么意思？下节课再讲！



## 总结动态规划特性

- 如何定义子问题

  - 前缀、后缀问题：最大公共子序列，最大递增子序列
  - 子串问题： 交替硬币游戏，括号问题
  - 整数子问题：切割杆问题，子集和问题，斐波那契数列; 

  - 多字符串问题：最大公共子序列
  - 顶点问题： SPS

  - 子问题约束/扩展
    - 非可扩展的限制： 最大递增子序列
    - 2x：交替硬币游戏，括号问题
    - θ(1)x: 钢琴指法问题
    - θ(x)x: Bellman-Ford

- 递归**关联**子问题（如果子问题定义是正确的，那么你可以写出一个递归关系）

  - θ(1) 分支: 斐波那契数列,  保龄球得分问题， LCS，ACG，Floy-wareshall
  - θ(degree) 分支: DAG, Bellman-ford
  - θ(n) branching: LIS, 括号问题, Rob Cutting
  - combine multiple sulution(not path in DAG): Fib, FW,括号

- Original: combine multiple subprobs: DAG, LIS, B-F, F-W