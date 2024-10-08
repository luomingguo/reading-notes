# Lec 11 存储分配

这节课关于内存的分配和释放。文献中就叫做Storage Allocation

## 总览

- 栈分配

- 堆分配 

  - 固定大小分配
  - 变长分配

- 垃圾回收

  - 引用计数法
  - 标记清除法
  - 停止-清除法

  



## 栈分配

![image-20240928165230671](http://198.46.215.27:49153/i/66f7c3d313cac.png)

- 分配和释放需要O(1)的时间复杂度
  - 非常的高效，不需要调用函数就可以实现数据的在栈的保存
- 必须与栈的LIFO原则释放。
- 应用有限，但在适用时效果很好！
- 以前可以用``alloca()``函数进行分配，但是已被弃用。编译器在使用固定大小的栈帧更高效



![截屏2024-06-08 16.10.16](http://198.46.215.27:49153/i/666411f37874a.png)

## 堆分配

- C提供了malloc()和free()

- C++提供了new和delete

C和C++没有垃圾回收，堆分配的存储必须显式地释放，不这样做会产生内存泄露(memory leak)，并且要小心悬空指针(dangling pointer)和重复释放(double freeing)，**Memory Checkers(e.g.，AddressSanitizer，Valgrind)**能够提供帮助。

- AddressSanitizer是一个编译器指令工具，当你编译时候传入一个flag，运行时候，它将报告内存bug信息
- Valrind直接对二进制代码进行分析，无需传特别的编译参数，直接交给它。但是后者比前者慢，且没有前者找bug的精确高效

> [!NOTE]
>
> 悬空指针是指，指向已经被释放的内存区域的指针，如果你对他们进行解引用，他们行为将是undefined的，比如可能是segmentation fault，行为不好说。

### 固定大小的堆分配

空闲块列表，块中有代表存储的固定大小的区域以及指向下一个空闲块指针。对于固定大小块的的维护，也可以用位图（bitmap）来实现。free是第一个空闲块的地址。

![image-20240928171113527](http://198.46.215.27:49153/i/66f7c83448d11.png)

**分配一块空闲块**

```c
// Allocate 1 object
x = free;
free = free->next;
return x; // should check free != NULL:
```

![image-20240928173543086](http://198.46.215.27:49153/i/66f7cdf1c3d5b.png)

**释放一块空闲块**

![image-20240928173754345](http://198.46.215.27:49153/i/66f7ce750330a.png)

- 原本free指向的是x->next;  

```c
// free object x
x->next = free;
free = x;
```

总结

- 分配和释放需要 $\Theta(1)$ 时间。
- 良好的时间局部性——你可以释放你需要的块。
- 由于 **外部碎片**，空间局部性较差——已使用内存的块分散在各处（分布在虚拟内存中）——这可能会增加页表的大小并导致 **磁盘抖动**（因为你需要在磁盘中移动页）。
- 快表（TLB）也可能是一个问题。因为你的数据分配到虚拟页太分散了

#### 减少外部碎片方法

- 每个磁盘页面维护一个空闲列表（或位图）
- 在分配内存时，优先选择那些已用内存最多的页面
- 释放一个内存块时，将其释放到它所在的页面的空闲列表中
- 如果一个页面变为空（所有块都是空闲的），虚拟内存系统可以将整个页面“换出”。

- 90-10 比 50-50 更好

![截屏2024-06-09 07.48.35](http://198.46.215.27:49153/i/6664eddaccbdc.png)

如果 90% 的内存使用在某些页面上，而 10% 在其他页面上（集中访问），相比于 50% 和 50% 的均匀分布，性能会更好



#### 合并内存块（Coalescing）

在使用**分区空闲列表（Binned Free Lists, BFL）**时，有时可以通过将相邻的小内存块拼接成一个更大的内存块来进行启发式优化。

- 存在一些巧妙的方案可以高效地找到相邻的内存块，例如“**伙伴系统（buddy system）**”，但其开销仍然大于简单的BFL。
- 没有好的理论界限能够证明合并的有效性。
- 在实践中，合并内存块似乎可以减少碎片化，因为堆存储的释放通常是以堆栈（**后进先出，LIFO**）或批量方式进行的。

### 可变大小的堆分配

Binned free lists，分箱空闲列表

- 提高内存效率
- 接受一定的内部碎片



![截屏2024-06-09 08.11.29](http://198.46.215.27:49153/i/6664f337b4bd9.png)

第k个分箱维持着$2^k$字节大小内存块。

> **如果我需要分配x字节内存怎么办？**

Solution: 

1. 如果分箱 $ k = \lceil \lg x \rceil$ 不是空，那么就返回分箱的一块内存渔区
2. 否则，找到下一个比他大的分箱$k'$，将其拆分成块$2^{k'-1}, 2^{k'-2},...,2^k$，然后分配到各个分箱上。

> 如果没有更大的内存块存在，怎么办？

找OS申请。区分sbrk和malloc，mmap

实际运用当中，会用一些变体，对于小块的内存分配尤其重要，比如最小块的区域是8bytes，否则小块的分配，会有一些性能瓶颈。

分配器的实现。

## 程序的存储layout

![截屏2024-06-09 12.55.17](http://198.46.215.27:49153/i/666535bcdba6f.png)

> Q.由于 64 位地址空间在以每秒 40 亿字节的速率写入的情况下需要一个多世纪才能填满，因此我们实际上永远不会耗尽虚拟内存。为什么不直接从虚拟内存中分配并且从不释放呢？

A. 外部碎片会非常严重！页表的性能将会显著下降，导致磁盘颠簸，因为所有非零内存都必须以页大小的块备份到磁盘上。（外部碎片是指在内存中出现的小块未使用空间，尽管总的可用内存可能足够，但由于这些小块的分散，无法满足特定大小的内存请求）

分配器的目标是尽量少使用虚拟内存，并且尽量保持已使用的部分相对紧凑。



> [!NOTE]
>
> 【定理】假设一个程序在任何时候使用的堆内存的最大量是M，如果由BFL分配器管理，那么需要的虚拟内存量是$O(M\lg M)$
>
> Proof： 一个大小为x字节的块分配请求会消耗$2^{\lceil \lg k \rceil } \le 2x$，其中k是满足$2^k \ge x$的最小整数，也就是说，分配内存的大小为$2^{\lceil \lg k \rceil }$， 即比x大的最小的2的幂，最终得到分配各大小$2^k$的块的虚拟容量最多为2x。由于至多有$\lg x$的空闲列表，因此答案得证。

BFL 分配器有时可以通过启发式的方法将相邻的小块合并成一个更大的块，从而改进其性能。这种方法通过减少碎片来提高内存利用率。

- 有一些聪明的方案可以高效地找到相邻的块，例如“伙伴系统”（buddy system）。伙伴系统通过将内存划分为大小为二的幂的块并按特定规则管理这些块，使得查找相邻块变得容易。然而，这种方法的开销仍然比简单的 BFL 更大。
- 没有好的理论界限来证明合并相邻块的有效性。
- 实践中，合并似乎可以减少碎片，这是因为堆内存通常以栈的方式（后进先出，LIFO）或成批地释放。这种释放模式有利于相邻内存块的合并，从而减少碎片化，提高内存利用率

## 垃圾回收

Garbage Collections，思想是使程序员无需考虑释放对象，GC会识别和回收程序不需要再访问的对象，并且能够内置在JAVA、Python或者自己运行

**术语**

- **根对象Roots** 指程序可以直接访问的对象，例如全局变量、栈中的变量等。这些对象通常是垃圾回收（GC）开始追踪其他对象的起点。
- **存活对象Live** 指通过从根对象出发、沿着指针引用能够到达的对象。也就是说，如果一个对象可以通过某个根对象的指针路径访问到，那么它就是存活对象
- **死对象Dead** 死对象是指无法通过任何根对象访问到的对象。这些对象被视为不再使用，因此可以被垃圾回收器回收和释放它们占用的内存

>  GC如何识别指针？

- 强制类型（指针永远是指针，like PY)

- 在某些编程语言（如 C/C++）中，指针可以进行算术运算（如 `ptr + 1`），这可能使得垃圾回收器难以确定哪些是有效的指针。你需要阻止指针运算。

### 引用计数法



![截屏2024-06-09 16.44.27](http://198.46.215.27:49153/i/66656b7318914.png)

限制： 如果循环引用，将无法地方进行垃圾回收。

![截屏2024-06-09 16.46.11](http://198.46.215.27:49153/i/66656bda1085d.png)

像C++语言，提供了弱引用，它并不会增加引用计数。

### 标记-清除法

思想是，如果能通过BFS找的对象，就是存活对象

```c
for (∀ v ∊ V) {
  if (root(v)) {
    v.mark = 1;
    equeue(Q, v);
  } else {
    v.mark = 0;
  }
}
while (Q != ∅) {
  u = dequeue(Q);
  for (∀ v ∊ V such that (u, v) ∊ E) {
    if (v.mark == 0){
      v.mark = 1;
      enqueue(Q, v);
    }
  }
}
```



初始状态![截屏2024-06-09 16.54.51](http://198.46.215.27:49153/i/66656de33d9ff.png)

![截屏2024-06-09 16.55.04](http://198.46.215.27:49153/i/66656df08578b.png)

![截屏2024-06-09 16.55.17](http://198.46.215.27:49153/i/66656dfe79a75.png)

![截屏2024-06-09 16.55.29](http://198.46.215.27:49153/i/66656e08a7008.png)

![截屏2024-06-09 16.55.44](http://198.46.215.27:49153/i/66656e17020b8.png)



![截屏2024-06-09 16.55.59](http://198.46.215.27:49153/i/66656e26d1d24.png)

![截屏2024-06-09 16.56.32](http://198.46.215.27:49153/i/66656e46f2088.png)

![截屏2024-06-09 16.57.00](http://198.46.215.27:49153/i/66656e63153d5.png)

![截屏2024-06-09 16.57.09](http://198.46.215.27:49153/i/66656e6d333b1.png)

标记阶段：深度优先搜索对所有的live object进行标记。

清除阶段： 扫描内存并释放没有标记的对象。

**限制**

标记清除法不能处理内存碎片的问题。

内存碎片化是指由于频繁的内存分配和释放，内存空间变得不连续，导致虽然总的可用内存足够，但无法为较大的内存分配请求提供连续的内存块

### 停止-复制法

停止-复制法， Stop-And-Copy

在标记-清除法中， 一个很重要的发现，在**所有的存活对象在Q中是连续存储的**。如果能将实际对象存放在队列中（连续的内存区域），把其他隐式删除掉，这样能够处理外部碎片的问题。

![截屏2024-06-09 17.10.57](http://198.46.215.27:49153/i/666571a8e8319.png)

![截屏2024-06-09 17.11.28](http://198.46.215.27:49153/i/666571c69dea2.png)



如果我们"FROM"空间满了， 就运行我的GC，将存活对象复制到"TO"空间（FIFO)，![截屏2024-06-09 17.12.02](http://198.46.215.27:49153/i/666571e862ff2.png)

![截屏2024-06-09 17.12.18](http://198.46.215.27:49153/i/666571f91e575.png)

**更新指针**

由于对象的 **FROM** 地址通常不等于对象的 **TO** 地址，因此指针必须更新。

- 当对象被复制到 **TO** 空间时，在 **FROM** 对象中存储一个**转发指针**（forwarding pointer），这隐含地将其标记为已移动。
- 当一个对象从 **TO** 空间的 FIFO 队列中移除时，更新该对象的所有指针。

**示例**



![image-20240929024638235](http://198.46.215.27:49153/i/66f84f12661f5.png)

从上图的”FROM“队列中移除一个元素

![image-20240929024840517](http://198.46.215.27:49153/i/66f84f8c2d288.png)

首先，将相邻的顶点（存活对象）入队，并以及指向FORM相关顶点（这里意会，不要求细节:）

![image-20240929025005220](http://198.46.215.27:49153/i/66f84fe17d5bb.png)

> 什么情况下判断”FULL“空间满了？

![image-20240929025809603](http://198.46.215.27:49153/i/66f851c401ae5.png)

请求一块新的堆空间，其大小等于已经使用的空间（加倍），并且当这块堆空间已经分配完毕时，将 **FROM** 空间视为“已满”。这样，垃圾回收的成本与新堆空间的大小成正比，并且摊销后的额外开销为 O(1)，假设用户程序访问了所有已分配的内存。

此外，通过将 **FROM** 和 **TO** 空间定位在虚拟内存（VM）的不同区域，使它们互不干扰，因此所需的虚拟内存空间是 O(1) 倍的最优空间。

**总结**

1. 能够解决外部碎片的问题
2. 线性时间处理复制和更新所有顶点（存活对象）



## 动态内存分配

策略包括

- 伙伴系统 buddy system
  - 思路是合并内存块

- 清除-标记的变体
- 分代GC
  - 基于刚分配对象的寿命很短，而对于不被释放的对象寿命很长
  - 大部分时间处理年轻的对象，而不是线性的扫描内存（老对象往往一直存活）

- 实时GC
  - 这节课讨论的，是假设程序在GC阶段没有运行，所以并不是实时的，而是静态的
  - 因此比较保守，并不总是释放所有垃圾


- 多线程存储分配 -- 下一节
- 并行GC --下一节

## 总结

- **栈（Stack）**：最基本的存储形式，当它适用时非常高效。
- **堆（Heap）**：更通用的存储形式。
- 使用**自由列表（free lists）**进行固定大小的分配。
- 使用**分区空闲列表（binned free lists）**进行可变大小的分配。
- **垃圾回收（Garbage collection）**——引用计数、标记清除（mark-and-sweep）、停止复制（stop-and-copy）。
- **内部和外部碎片化**。
- 你将在**作业6**和**项目3**中研究存储分配。

 

