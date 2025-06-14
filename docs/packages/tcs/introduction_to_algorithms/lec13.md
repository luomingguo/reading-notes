

# Lec 13 Dijkstra's 算法

- 非负权重边
- Dijkstra's 算法

## 非负权重边

- 思路： 将BFS的方法推广到加权图
  - 以源点s为中心扩展球面
  - 反复搜索更近的顶点，然后再搜索更远的顶点
  - 但如果事先不知道距离，如何搜索更近的点？
- 观察1： 如果权重非负，则沿着最短路径的距离单调增加
  - 即，如果顶点u出现在s到v的最短路径上，则$\delta(s, u) \le \delta(s, v)$
  - 设 $V_x \subset V$ 是从s出发可到达的距离 $\le x$ 的顶点子集（分层子集）
  - 如果$v \in V_x$，则从s到v的任何最短路径经过的顶点都在$V_x$内
  - 或许可以一次扩展一个顶点来增长$V_x$​（ 但是如果权重很大，为每个x扩展会很慢）
- 观察2： 如果给定从s出发按距离递增顺序排列的顶点，可以快速解决SSSP问题
  - 移除违反此顺序的边（因为有些边不能参与最短路径）
  - 如果存在零权重边，可能仍然会有环： 反复合并成单个顶点
  - 使用DAG松弛法在O(|V| + |E|)时间内计算出每个$v\in V$的$\delta(s, v)$

## Dijkstra’s 算法

- 思路： 从源点s出发到各顶点的距离递增顺序松弛边

- 如何做到按距离递增？ 用一种数据结构能有序地找到下一个顶点，比如 **可变优先队列**Q，其数据项带有键和唯一ID，支持的操作有

  | 操作                    | 描述                                     |
  | ----------------------- | ---------------------------------------- |
  | `Q.build(X)`            | 用迭代器 `X` 中的项初始化 `Q`            |
  | `Q.delete_min()`        | 删除键最小的项                           |
  | `Q.decrease_key(id, k)` | 找到具有ID `id` 的存储项并将键更改为 `k` |

- 通过交叉链接(cross-linking)优先队列Q'和一个字典D将ID映射到Q‘中

- 假设顶点是ID从0到 |V| -1 的证书，因此可以使用直接访问数组来实现字典D

- 为了简洁起见，假设数据项x是一个元祖(x.id, x.key)