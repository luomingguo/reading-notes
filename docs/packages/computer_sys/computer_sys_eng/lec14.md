# Lec 14 数据中心和云

## 思考题

- 数据中心网络的物理基础设施是什么样的？比如什么是机架？

- 网络拓扑是什么样的？
- 我们如何进行路由？
  - 什么是“多路径路由”？
  - 多路径路由协议需要处理哪些单路径路由协议（例如链路状态或距离矢量）不需要处理的问题？
- 数据中心中的集中控制器负责什么？
- 数据中心网络与内容分发网络（CDN）如何比较？

- 数据中心网络与互联网如何比较？

- 在数据中心网络中，以下每个领域有哪些关注点？

  - 性能

  - 可扩展性

  - 容错性

  - 安全性



## 数据中心网络



> [!NOTE]
>
> 机架：专门用来装载多个服务器、交换机和其他网络设备。

为了建立跨机架通信链路，可能设计成如下。

![截屏2024-07-14 02.10.05](http://14.103.135.111:49153/i/6692c30587ff2.png)

> 这种拓扑有什么缺点吗？

这里没有**冗余(redundancy)**， 在失败时没有备用线路，如下图所示

![截屏2024-07-14 02.11.51](http://c)

解决办法：Clos/Fat-tree拓扑。利用多条路径、提供高带宽和冗余。

![截屏2024-07-14 02.13.23](http://14.103.135.111:49153/i/6692c3ceb4ee7.png)

数据中心通常采用多级分层拓扑结构，Clos/Fat-tree拓扑就是其中一种，我们可以看到有三层网络交换机，至底向下分别是

- Top-of-rack(ToR) 机顶交换机：通常每个机架都有一个 ToR 交换机。
- 聚合(Aggregate)交换机。用于连接多个 ToR 交换机和其他聚合交换机。它们处理来自多个 ToR 的流量
- 核心（Core）交换机：位于数据中心网络的最高层，负责连接所有聚合交换机、跨数据中心连接和对外连接。核心交换机通常具有高吞吐量和低延迟，是数据中心网络的中枢

-----

## 多路径路由

![截屏2024-07-14 02.18.30](http://14.103.135.111:49153/i/6692c4fed74dd.png)

标准的路由协议会挑选一个简单路径并坚持使用它，直到情况有所改变； 多路径则可以在不同的路径中转发。

> 假设我们使用轮流调度（round-robin scheduling）将单个TCP流的数据包发送到这两条路径上，可能会发生什么？

Soluiton：这种方式是数据包级别的负载均衡，可能会导致TCP乱序问题， 使得拥塞控制更加困难。

> 假设我们使用， 等价多路径ECMP，即每条路径的成本相同，TCP流会发生什么？

Solution： ECMP常见地使用哈希算法决定数据包的转发路径，基于5元组计算哈希值，映射到同一条路径。

![截屏2024-07-14 02.32.43](http://14.103.135.111:49153/i/6692c856381ea.png)

许多数据中心使用集中式控制器（SDN）来管理路由和其他事务，大致来说：

- 流量管理： 动态优化流量路径、避免拥塞
- 策略管理： 实现访问控制、ACL
- 负载均衡
- 网络虚拟化：提供逻辑分区，如Vxlan

比如, 图示的虚拟机迁移。 每台物理机器可以承载多个虚拟机，有时这些虚拟机需要在网络中移动。因为数据中心网络受到单一管理实体的控制，我们对网络的控制程度远远超过在互联网上的控制。

![截屏2024-07-14 02.35.28](http://14.103.135.111:49153/i/6692c905d5c09.png)



数据中心网络 vs CDN

| 特性         | **数据中心网络（DCN）**    | **内容分发网络（CDN）**    |
| ------------ | -------------------------- | -------------------------- |
| **目标**     | 计算、存储                 | 提供内容（网页、视频）     |
| **流量模式** | 东西向流量（服务器间通信） | 南北向流量（服务器到用户） |
| **拓扑**     | Clos、Fat-tree             | 地理分布的 PoP 站点        |
| **协议**     | SDN、VXLAN、ECMP           | Anycast、HTTP Caching      |

数据中心 vs 互联网

| 特性         | **数据中心网络（DCN）**  | **互联网**         |
| ------------ | ------------------------ | ------------------ |
| **控制方式** | 集中控制（SDN）          | 分布式 BGP         |
| **流量模式** | 低延迟、高带宽、对称     | 高延迟、异步、动态 |
| **拓扑**     | 规则化（Clos、Fat-tree） | 复杂、异构         |



# 论文阅读：物理可部署性的影响

这篇论文关于在数据中心实际部署新网络设计的问题。 物理部署能力指的是“网络设备与物理世界之间的互动”。大白话就是，机房，配套的物理环境限制下的设计还是否可行？在网络研究人员中，传统上并不是一个非常重要的关注点。许多在纸上看起来很好的设计实际上可能不具备物理部署能力（或需要进行改变才能部署），优先考虑物理部署能力可能意味着优先考虑可替代性而非我们“正常”的性能指标

[Physical Deployability Matters, HotNets’23](https://conferences.sigcomm.org/hotnets/2023/papers/hotnets23_mogul.pdf)

## 思考题

- What. 这篇论文关于什么？ 作者所说的”物理可部署性“意味着什么？
- Who. 在数据中心网络谁会关心物理可部署性？
- Why. 为什么物理部署能力通常不是网络研究人员关注的主题？



- 为什么你认为物理部署能力在研究文献中通常不被关注？这是一个问题吗？如果是，是否有解决方案？
- 如果一个新的数据中心设计没有考虑到物理部署能力，那么它是否有用？
- 论文指出，“抽象无疑是必要的，但隐藏的约束意味着看起来在纸上吸引人的设计可能会变得不可行。”作为系统设计者，我们应该如何应对？我们能做些什么来制定更好的抽象？如何更好地了解这些约束？
- 论文使用了诸如“部署时间”、“部署成本”、“首次通过率”等指标。我们如何计算这些指标？谁可以计算它们？我们应该如何思考这些指标与“正常”的性能指标（如延迟、吞吐量等）的关系？它们是否有时是相互矛盾的？

## 物理部署困难点

抽象无疑是必要的，但隐藏的约束意味着看起来在纸上吸引人的设计可能会变得不可行。大致有5种物理限制。

### 物理可行性

比如，更长的电缆距离会引入更多的问题，如信号衰减和成本增加等等等等

### 操作挑战

频繁的操作和维护坑会影响网络的安全的可靠性。

### 成本和供应链问题

成本效益，可替换性等等

## 案例学习

### 间接层的帮助

早期研究主张扁平化，其中ToR直接相连，而不是通过层级结构（如Clos或Leaf-spine网络）连接。这种方式可以减少路径长度，从而降低固有网络延迟，并可能减少网络拥塞。然而，Marty 等人发现，在纯扁平化蝶形拓扑（flattened butterfly topology）中直接连接 ToR 在运维上存在挑战，因为数据中心经常新增或移除机架，这会影响网络运维。因此，扁平化网络的性能优势可能无法弥补其运维成本。在 Clos 网络的上层结构中，引入间接连接（indirection） 也有所帮助。



> [!NOTE]
>
>  **Spine-Leaf 的工作原理**: 相当于传统三层架构中的接入交换机，作为 TOR（Top Of Rack）直接连接物理服务器。与接入交换机的区别在于 L2/L3 网络的分界点现在在 Leaf 交换机上了。Leaf 交换机之上是三层网络，Leaf 交换机之下都是个独立的 L2 广播域，这就解决了大二层网络的 BUM 问题。如果说两个 Leaf 交换机下的服务器需要通讯，需要通过 L3 路由，经由 Spine 交换机进行转发
>
> ![image-20250312125106452](http://14.103.135.111:49153/i/6852e8673ea1a.png)

### 为什么expanders 没有广泛采用

描述数据中心网络中 **expander-graph** 结构的论文，这些网络在理论和仿真分析中**优于** Clos 和叶脊（leaf-spine）网络。然而，我们尚未发现这些网络被商业化部署的描述。由于缺乏部署先例，不做吃螃蟹的那个...

### 对现有网络的设计变更

在实际运行的网络中进行这一操作时，我们首先需要暂时停止每个 OCS 机架的流量，然后技术人员执行复杂的任务，将大量光纤移动，而不造成任何损坏或错误连接，最后再恢复流量。

从这次经验中，我们得出了两个教训。首先，网络的有效生命周期可以超过其原始设计的生命周期；**间接层（indirection）**使得在现有网络上进行“重新设计”变得更加容易。其次，软件定义网络（SDN）控制平面不仅仅能更新流表，它还可以协调需求预测、可用性要求、分阶段进行的低影响手动操作、必要的流量停止和恢复，以及自动化的布线错误测试。



## 如何降低复杂性？

有几类创新在未来可以降低数据中心网络物理部署的复杂性

- 技术创新： 新的或是提升软硬件技术
- 操作创新： 更好地组织部署的过程
- 数字孪生；用数字技术代表现实世界的物理产品、系统或者操作方式



### 技术创新

Zhao 等人提出了计算最小操作成本的算法，以更新 Clos 网络中的配线面板（patch panel），这一问题是 NP 完全的。一些供应商提供“主动”或“智能”配线面板，这些面板可以监控配线面板连接的状态，并协助远程或自动化故障诊断。然而，与被动配线面板相比，它们的成本更高，并且可能容易受到软件漏洞的影响。

### 过程创新

经验表明，如果新设计与先前设计在很大程度上相似，并且我们能够轻松地区分它们如何不同，将新设计部署到数据中心网络中会更加容易。定义“在很大程度上相似”是一个挑战，因为：

1. 看似微小的变化可能会导致严重的部署难题；
2. 设计可以在多个维度上存在差异；
3. 可能的设计范围非常广泛。



但是呢，从代码向数据的这种知识迁移是缓慢且有时难以正确实现的。

### 数字孪生

### 定义指标

鉴于网络设计与物理部署之间相互作用的复杂性， 如果有明确定义的评估设计的指标和目标，网络设计者，将从中受益。需要整数线性规划（ILP）等方法，通过指标表达物理部署的目标，就变成了一个最优化问题，前提需要量化这些指标。部署性能指标的另一个价值在于，它们可能会减少采用新设计时的恐惧感。如果能预测到新设计不会带来重大的部署问题。

不幸的是，由于我们无法总是预测网络设计的未来演变如何影响部署性能，定义一个封闭的部署性能指标集似乎是不可能的；在这一领域总会有新的研究领域

