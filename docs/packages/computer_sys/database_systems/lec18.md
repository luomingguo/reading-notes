# Lec 18 集群计算：Spark

> 阅读资料
>
> Resilient Distributed Datasets: **A Fault-Tolerant Abstraction for In-Memory Cluster Computing**. nsdi‘2012 [[PDF](https://cs.stanford.edu/~matei/papers/2012/nsdi_spark.pdf)]

这节Lecture，我们讨论Spark，一种集群计算语言，与MapReduce有类似的设计目标，但是在性能、缓存、可编程性上有所提升。我们已经学习了各种各样的DB，数据分析为主的C-store数据库、事务处理为主的H-store数据库、高可用的DynamoDB、云化的AuraraDB等等，本节我们将学习一个新的，针对数据科学（data science）而生的数据系统Spark

边阅读边思考一下问题：

- Spark计算模型和MapReduce相比有什么相似的？有什么区别？
- 什么是弹性分布式数据集（RDD）？ 如何帮助程序员写出容错的程序？

 

数据科学包括从数据中提取有用信息的任务，尤其是对大量的数据进行处理和分析。需要高效的并行处理一次性执行（One-Off）的任务，区别于持续执行的，典型的包括，特征化是指将原始数据转化为机器学习算法可以使用的特征；对数据进行索引；从原始数据中提取有用的信息，这可能包括数据的聚合、统计或数据清洗等。

大多数数据科学任务涉及 从非结构化数据（unstructured data）转化为结构化数据（structured data） 的过程。数据处理操作并不完全是传统的 SQL 查询操作，但它们的模式和 SQL 中的过滤（filter）和连接（join）操作有相似之处。MapReduce、Hadoop 和 Spark，都是处理大规模数据的并行计算框架。

## Mapreduce

在分布式集群内处理大规模数据的编程模型。编程规范：

- Map函数： 处理输入的K/V对，并产生中间K/V对
- Reduce函数： 对具有相同的K的中间值进行归并。

例子

```python
def map(key, value):
  for word in value.split():
    emit(word, 1)
    
def reduce(key, values):
  total_count = sum(values)
  emit(key, total_count)
# input: [('doc1', 'hello world'), ('doc2', 'hello mapreduce’)]
# output: [('hello', 2), ('world', 1), ('mapreduce', 1)]
```

### 执行过程

- Input Splitting。数据被分区成多chunks，以便为了能够map任务并行处理
- mapping。每个chunk被一个map任务独立地处理
- shuffling。中间K/V对根据K进行排序和分组
- Reducing。 每组中间值都被一个reduce任务处理
- output： 从reduce任务生成出结果。

![image-20250326145952068](http://14.103.135.111:49153/i/6852e3d9e841c.png)

### 分析

**优点**：MapReduce 这种框架让开发者可以轻松实现并行计算，而不需要关心底层的复杂性。提供了高层次的计算抽象，主要包括 `map()` 和 `reduce()` 两种核心操作。不需要预定义数据的结构（Schema-Free）

**缺点**：对集群中节点的内存利用率低，甚至没有利用。对于迭代（iterative）或交互式（interactive）任务，数据重用会有很大的开销。虽然不需要提前定义数据模式（Schema-Free）是优点，但也带来了缺点，主要体现在数据管理和查询优化方面。MapReduce 系统的实现通常会有较高的延迟（Latency）。



## Spark： 弹性数据集RDD

Spark利用分布式内存，提供高效的容错。

- 避免显式地存储数据更新。Spark 不会直接将每次操作后的数据结果写入磁盘，而是通过 记录操作的变换逻辑（lineage，血统） 来重建数据，而不是像 MapReduce 那样存储中间数据。

Spark 只支持 **粗粒度操作**（Coarse-Grained Transformation），即对整个数据集进行批量处理，而不是对单个记录的细粒度操作

Spark 允许用户显式地控制数据是否持久化、如何分区、是否缓存

### RDD是什么

RDD 是不能直接修改，被分区到不同节点的记录集合。它有两种操作，一个是Transformation（转换操作），对RDD执行某种变换，生成新的RDD，但其是懒执行；另外一个是Action（行动操作），真正触发计算，返回结果或者将结果输出到外部存储。

有几个特性。

- 懒执行。可以自动优化执行计划，避免多次重复计算
- 容错。如果某个分区丢失，Spark可以通过RDD的血统信息自动恢复
  - 血统 (lineage)：是 RDD 的生成历史，记录从输入到输出的所有操作。如果数据丢失，Spark 可基于血统信息，从原始数据重新计算
- 推测执行。当某个任务执行速度慢时，Spark 可以启动一个备用任务以加速完成，避免因个别节点瓶颈拖慢整体速度。
  - Mapreduce也可以这样做

举个例子

![image-20250326155309398](http://14.103.135.111:49153/i/6852e3de62a62.png)

```python
lines = spark.textFile("hdfs://..")
errors = lines.filter(_.startsWith("ERROR"))
errors.count()
```

![image-20250326163758279](http://14.103.135.111:49153/i/6852e3e199c8e.png)

![image-20250326171351669](http://14.103.135.111:49153/i/6852e3e562b1b.png)

![image-20250326171416868](http://14.103.135.111:49153/i/6852e3e8eef09.png)

![image-20250326171432109](http://14.103.135.111:49153/i/6852e3ec6cf64.png)

### RDD容错性

RDD只日志记录Transformation，而不复制数据，并且限制其操作为粗粒度的。

Lineage: transformations used to build a dataset • Recover lost partition by applying lineage from corresponding data  partition in stable storage • Because data is read-only, this is always possible 怎么连接诶

# 论文阅读： RDDs

《Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing, OSDI'12》 最佳博士论文

Mapreduce的论文是在2008年，分布式图计算框架Pregel是2010年

## 概述

RDD（翻译为弹性分布式数据集）这是一种分布式内存抽象，允许程序员在大型集群上以容错的方式执行内存计算。RDDs 的设计动机源于当前计算框架无法高效处理的两类应用程序：迭代算法和交互式数据挖掘工具。在这两种情况下，将数据保存在内存中可以将性能提升一个数量级。为了高效地实现容错，RDDs 提供了一种受限的共享内存形式，基于**粗粒度的转换**（coarse-grained transformations），而非对共享状态的细粒度更新。我们展示了 RDDs 足够表达一大类计算，包括最近专门为迭代作业设计的编程模型（如 Pregel）等等。我们在一个名为 Spark 的系统中实现了 RDDs，并通过多种用户应用和基准测试对其进行了评估。

## 1 介绍

集群计算框架如MapReduce 和Dryad已经被广泛采用于大规模数据分析。这些系统允许用户使用一组高级操作符编写并行计算，而无需担心工作分配和容错问题。尽管现有的框架提供了众多用于访问集群计算资源的抽象，但它们**缺乏利用分布式内存的抽象**。在许多迭代的机器学习和图算法中，如PageRank、K均值聚类和逻辑回归，数据重用非常常见。另一个引人注目的用例是交互式数据挖掘，用户在同一数据子集上运行多次临时查询。不幸的是，在大多数现有框架中，在计算之间重用数据（例如，在两个MapReduce作业之间）唯一的方法是将数据写入外部的稳定存储系统，例如分布式文件系统。

认识到这个问题，研究人员为一些需要数据重用的应用开发了专门的框架，比如Pregel是一个迭代式的图计算框架，将中间数据在内存中保持。然而，这些框架仅支持特定的计算模式（例如循环执行一系列 MapReduce 步骤），并且仅在这些模式下**隐式**地执行数据共享。它们**不提供更通用的数据复用抽象**。 我们提出了一种新的抽象，称为弹性分布式数据集（RDD），它可以在广泛的应用中实现高效的数据重用。RDD是一种容错的并行数据结构，允许用户显式地将中间结果持久化在内存中，控制它们的分区以优化数据的放置，并使用丰富的操作符集合来操作它们。

设计RDD的主要挑战在于定义一个能够**高效**提供**容错**的编程接口。现有的集群内存存储抽象，如分布式共享内存、键值存储、数据库和Piccolo，提供的接口基于对可变状态（例如表格中的单元格）的细粒度更新。对于这种接口，提供容错的唯一方法是将数据复制到多台机器上或跨多台机器记录更新。这两种方法对于数据密集型工作负载来说都很昂贵，因为它们需要通过集群网络复制大量数据，而集群网络的带宽远低于RAM，并且它们会产生大量的存储开销。

与这些系统相比，RDD提供了一个基于粗粒度变换（例如，map、filter和join）的接口，该变换将同一操作应用于许多数据项。这使得RDD能够通过记录用于构建数据集的变换而不是实际数据，来高效地提供容错。如果RDD的一个分区丢失了，RDD拥有足够的信息来重新计算丢失的分区，而无需昂贵的复制。因此，丢失的数据可以快速恢复，而不需要高成本的复制。尽管基于粗粒度变换的接口乍看起来可能有限，但RDD非常适合许多并行应用，因为这些应用自然地将同一操作应用于多个数据项。

我们在一个称为Spark的系统中实现了RDD，该系统正在加州大学伯克利分校和几家公司用于研究和生产应用。Spark提供了一个方便的语言集成编程接口，类似于Scala编程语言中的DryadLINQ [31]。此外，Spark可以交互式地用于从Scala解释器查询大数据集。我们相信，Spark是第一个允许使用通用编程语言以交互速度在集群上进行内存数据挖掘的系统。

Spark比Hadoop快20倍，加速了一个现实世界的数据分析报告40倍，并且可以交互式地以5-7秒的延迟扫描1 TB的数据集。更为根本的是，为了说明RDD的通用性，我们在Spark之上实现了Pregel和HaLoop编程模型，包括它们所采用的放置优化

本文首先概述了RDD (§2)和Spark (§3)，然后讨论了RDD的内部表示 (§4)、我们的实现 (§5)和实验结果 (§6)。最后，我们讨论了RDD如何捕捉几个现有的集群编程模型 (§7)，回顾相关工作 (§8)，并作出总结。

## 2 弹性分布式数据集（RDDs)

本节提供了对RDD的概述。我们首先定义RDD (§2.1) 并介绍它们在Spark中的编程接口 (§2.2)。接着，我们将RDD与更细粒度的共享内存抽象进行比较 (§2.3)。最后，我们讨论RDD模型的局限性 (§2.4)

### 2.1 RDD抽象

形式上，RDD是一个只读的、分区的记录集合。RDD只能通过对稳定存储中的数据或其他RDD进行确定性的操作来创建。我们称这些操作为转换（Transformation），以区别于对RDD进行的其他操作。转换的例子包括map、filter和join。RDD不需要一直被物化。相反，RDD有足够的信息来重建其分区，这些信息来源于其他数据集（即RDD的血统）。这种属性非常强大：本质上，一个程序不能引用它在故障后无法重建的RDD。最后，用户可以控制RDD的两个方面：持久性和分区。用户可以指示哪些RDD将会被重用，并为其选择存储策略（例如，内存存储）。他们还可以要求根据记录中的键在机器间对RDD的元素进行分区。这对于放置优化非常有用，例如确保将要连接的两个数据集以相同的方式进行哈希分区。

### 2.2 Spark的编程接口

Spark通过类似于DryadLINQ [31] 和 FlumeJava [8] 的语言集成API暴露RDD，在这些API中，每个数据集被表示为一个对象，并且可以通过这些对象上的方法调用转换。

程序员首先通过对稳定存储中的数据进行转换（例如map和filter）来定义一个或多个RDD。然后，他们可以在操作中使用这些RDD，这些操作返回一个值给应用程序或将数据导出到存储系统。操作的例子包括count（返回数据集中的元素数）、collect（返回元素本身）和save（将数据集输出到存储系统）。像DryadLINQ一样，Spark在第一次使用操作时懒惰地计算RDD，以便能够对转换进行流水线处理。

此外，程序员可以调用persist方法来指示哪些RDD他们希望在未来的操作中重用。默认情况下，Spark将持久化的RDD保存在内存中，但如果内存不足，它可以将它们溢出到磁盘。用户还可以通过persist的标志请求其他持久化策略，例如仅将RDD存储在磁盘上或在机器间复制。最后，用户可以为每个RDD设置持久化优先级，以指定哪些内存数据应首先溢出到磁盘。

#### 2.2.1 示例： 控制台日志挖掘

![截屏2024-09-04 16.10.57](http://14.103.135.111:49153/i/66d8162149931.png)

假设某个Web服务遇到了错误，运维人员希望搜索Hadoop文件系统（HDFS）中的海量日志，以查找问题的原因。使用Spark，运维人员可以将日志中的错误消息加载到一组节点的内存中，并进行交互式查询。

首先，她会输入以下Scala代码：

```scala
lines = spark.textFile("hdfs://...")
errors = lines.filter(_.startsWith("ERROR"))
errors.persist()
```

第一行定义了一个由HDFS文件支持的RDD（作为文本行的集合），第二行从中派生出一个过滤后的RDD。第三行要求将错误消息持久化到内存中，以便可以在查询中共享它们。请注意，`filter`的参数是Scala语法中的闭包。

此时，集群上尚未执行任何工作。然而，用户现在可以在操作中使用RDD，例如，计算消息的数量：

```scala
errors.count()
```

用户还可以对RDD进行进一步的转换并使用其结果，如以下几行代码所示：

```scala
// 统计包含MySQL的错误：
errors.filter(_.contains("MySQL")).count()
// 返回包含HDFS的错误的时间字段作为数组（假设时间是制表符分隔格式中的字段号3）：
errors.filter(_.contains("HDFS"))
.map(_.split(’\t’)(3))
.collect()
```

在第一次涉及errors的操作运行后，Spark将把错误的分区存储在内存中，从而大大加快后续的计算。请注意，基础RDD（lines）不会加载到RAM中。这是理想的，因为错误消息可能只是数据的一小部分（小到可以装入内存）。

最后，为了说明我们的模型如何实现容错性，我们展示了图1中RDD在第三个查询中的血统图。在此查询中，Spark 会将 `filter` 和 `map` 组合为一个任务，分发到集群中每个分区执行，计算完成后，`collect()` 会将所有符合条件的数据汇集回驱动程序。实际上这段代码是，提取包含 "HDFS" 的错误中的时间字段，`collect()`会触发action，返回一个包含时间字段的数组。容错机制 基于血统：如果某个分区丢失，Spark 仅需重算丢失的分区，而非全部数据。

### 2.3 RDD模型的优势

为了理解RDD作为分布式内存抽象的好处，我们在表1中将其与分布式共享内存（DSM）进行了比较。在DSM系统中，应用程序读取和写入全局地址空间中的任意位置。DSM是一个非常通用的抽象，但这种通用性使得在商品集群上以高效和容错的方式实现它变得更加困难。

| **方面**             | **RDDs**                             | **分布式共享内存 (DSM)**               |
| -------------------- | ------------------------------------ | -------------------------------------- |
| **读取操作**         | 粗粒度或细粒度                       | 细粒度                                 |
| **写入操作**         | 粗粒度                               | 细粒度                                 |
| **一致性**           | 简单（不可变）                       | 由应用程序或运行时环境决定             |
| **故障恢复**         | 使用数据血统进行细粒度、低开销的恢复 | 需要检查点和程序回滚                   |
| **缓慢节点缓解**     | 通过备份任务实现                     | 难以实现                               |
| **工作分配**         | 基于数据位置自动安排                 | 由应用程序决定（运行时环境尝试透明化） |
| **内存不足时的行为** | 类似于现有的数据流系统               | 性能差（可能出现交换？）               |

RDD与DSM的主要区别在于，RDD只能通过粗粒度的转换（例如map和filter）来创建（"写入"），而DSM允许对每个内存位置进行读写。这限制了RDD只能用于执行批量写入的应用程序，但允许更高效的容错性。特别是，RDD不需要产生检查点的开销，因为它们可以通过血统信息进行恢复。此外，在故障发生时，只需重新计算RDD的丢失分区，并且可以在不同的节点上并行进行重新计算，而不需要回滚整个程序。

RDD的另一个好处是，由于其不可变性，系统可以通过运行慢速任务的备份副本来缓解慢速节点（"拖尾"）的影响，如MapReduce [10]中的实现。如果是DSM，则难以实现备份任务，因为任务的两个副本将访问相同的内存位置，并干扰彼此的更新。

最后，RDD相比于DSM还提供了两个其他好处。首先，在RDD上的批量操作中，运行时可以基于数据本地性进行任务调度，以提高性能。其次，只要RDD仅用于基于扫描的操作，当内存不足以存储它们时，它们会优雅地退化。未能装入RAM的分区可以存储在磁盘上，并提供与当前数据并行系统相似的性能。

### 2.4 不适合RDD的应用

RDD最适合批处理应用，这些应用对数据集的所有元素应用相同的操作。在这些情况下，RDD可以高效地记住每次转换作为血统图中的一个步骤，并且可以在不需要记录大量数据的情况下恢复丢失的分区。RDD不太适合那些对共享状态进行异步细粒度更新的应用，例如Web应用程序的存储系统或增量Web爬虫。对于这些应用，使用执行传统的更新日志记录和数据检查点的系统更为高效。我们的目标是为批量分析提供一种高效的编程模型，并将这些异步应用留给专用系统



## 3 RDD抽象的Spark实现

Spark通过一个类似于DryadLINQ的语言集成API来提供RDD（Resilient Distributed Dataset）抽象。该API在Scala中实现，Scala是一种用于Java虚拟机（JVM）的静态类型的函数式编程语言。我们选择Scala是因为它具有简洁性（便于交互使用）和效率（由于静态类型）。不过，RDD抽象本身并不需要函数式语言。

![截屏2024-09-04 16.42.14](http://14.103.135.111:49153/i/66d81d7440b03.png)

为了使用Spark，开发者编写一个驱动程序，该程序连接到一组工作节点，如图2所示。驱动程序定义一个或多个RDD，并在其上调用操作。驱动程序中的Spark代码还跟踪RDD的血统（即数据的来源和变换过程）。工作节点是持久化的进程，可以在多次操作之间将RDD的分区存储在RAM中。

正如我们在第2.2.1节的日志挖掘示例中所展示的，用户通过传递闭包给RDD操作（如`map`）来提供参数。Scala将每个闭包表示为一个Java对象，这些对象可以序列化并加载到另一个节点上，以在网络上传递闭包。Scala还将闭包中绑定的变量作为字段保存在Java对象中。例如，可以编写如下代码来将5添加到RDD的每个元素中：`var x = 5; rdd.map(_ + x)`。

RDD本身是具有静态类型的对象，其参数化的元素类型。例如，`RDD[Int]`表示一个整数的RDD。然而，由于Scala支持类型推断，大多数示例中我们省略了类型。

尽管我们在Scala中暴露RDD的方法在概念上很简单，但我们不得不使用反射来解决Scala的闭包对象的一些问题。我们还需要更多的工作来使Spark在Scala解释器中可用，具体内容将在第5.2节讨论。然而，我们并没有修改Scala编译器。

### 3.1 Spark中的RDD操作

![截屏2024-09-04 16.43.39](http://14.103.135.111:49153/i/66d81dc4590a3.png)

表2列出了Spark中主要的RDD转换和动作操作。我们给出了每个操作的签名，使用方括号表示类型参数。回想一下，转换操作是定义一个新RDD的惰性操作，而动作操作会启动计算以将值返回给程序或将数据写入外部存储。需要注意的是，一些操作（如`join`）只在键值对RDD上可用。此外，我们选择的函数名称与Scala和其他函数式语言中的API相匹配；例如，`map`是一个一对一的映射，而`flatMap`将每个输入值映射到一个或多个输出（类似于MapReduce中的`map`）。

除了这些操作之外，用户还可以要求持久化一个RDD。此外，用户可以获取一个RDD的分区顺序，该顺序由一个Partitioner类表示，并根据它对另一个数据集进行分区。诸如`groupByKey`、`reduceByKey`和`sort`之类的操作会自动生成哈希或范围分区的RDD。

### 3.2 示例应用程序

我们用两个迭代应用程序来补充第2.2.1节中的数据挖掘示例：逻辑回归和PageRank。后者还展示了如何控制RDD的分区以提高性能。

#### 3.2.1 逻辑回归

许多机器学习算法具有迭代性，因为它们运行迭代优化过程（如梯度下降）来最大化一个函数。通过将数据保存在内存中，这些算法可以运行得更快。

作为示例，以下程序实现了逻辑回归，一种常见的分类算法，用于寻找最佳分隔两个点集（如垃圾邮件和非垃圾邮件）的超平面w。该算法使用梯度下降：从随机值w开始，在每次迭代中，通过在数据上求和一个函数来移动w，使其更接近优化目标。

```scala
val points = spark.textFile(...)
  .map(parsePoint).persist()
var w = // 随机初始向量
for (i <- 1 to ITERATIONS) {
  val gradient = points.map { p =>
    p.x * (1/(1+exp(-p.y*(w dot p.x)))-1)*p.y
  }.reduce((a, b) => a + b)
  w -= gradient
}

```

我们首先通过对文本文件执行`map`转换，并解析每行文本为一个`Point`对象，定义了一个持久化的RDD，名为`points`。然后我们在每次迭代中反复对`points`执行`map`和`reduce`操作，以计算每一步的梯度，方法是对当前`w`的一个函数求和。通过在迭代之间保持`points`在内存中，可以实现20倍的加速。

#### 3.2.2  PageRank

![截屏2024-09-04 16.45.21](http://14.103.135.111:49153/i/66d81e2a7cad8.png)

在PageRank中发生了更复杂的数据共享模式。该算法通过累加来自链接到它的文档的贡献，迭代地更新每个文档的排名。在每次迭代中，每个文档向其邻居发送一个贡献`r/n`，其中`r`是其排名，`n`是其邻居的数量。然后它将其排名更新为`α/N + (1 − α)∑ci`，其中累加和来自收到的贡献，`N`是文档总数。

```scala
// 加载图作为(URL, 出链)对的RDD
val links = spark.textFile(...).map(...).persist()
var ranks = // (URL, 排名)对的RDD
for (i <- 1 to ITERATIONS) {
  // 构建一个RDD (targetURL, float)对，
  // 其中包含每个页面发送的贡献
  val contribs = links.join(ranks).flatMap {
    case (url, (links, rank)) =>
      links.map(dest => (dest, rank / links.size))
  }
  // 通过URL求和贡献并获取新排名
  ranks = contribs.reduceByKey((x, y) => x + y)
    .mapValues(sum => α / N + (1 - α) * sum)
}

```

这个程序导致了图3中的RDD血统图。在每次迭代中，我们根据前一轮的`contribs`和`ranks`以及静态的`links`数据集创建一个新的`ranks`数据集。这个图的一个有趣特性是它随着迭代次数的增加而变得越来越长。因此，在有很多迭代的作业中，可能需要可靠地复制一些`ranks`的版本，以减少故障恢复时间。用户可以通过调用带有`RELIABLE`标志的`persist`方法来实现这一点。

最后，我们可以通过控制RDD的分区来优化PageRank中的通信。如果我们为`links`指定了一个分区方式（例如，通过URL对链接列表进行哈希分区），我们可以以同样的方式对`ranks`进行分区，确保`links`和`ranks`之间的连接操作不需要通信（因为每个URL的排名会与其链接列表位于同一台机器上）。我们还可以编写自定义的Partitioner类，将相互链接的页面分组在一起（例如，按域名对URL进行分区）。这两种优化都可以通过在定义`links`时调用`partitionBy`来表达：

```scala
links = spark.textFile(...).map(...)
  .partitionBy(myPartFunc).persist()
```

在此初始调用之后，`links`和`ranks`之间的连接操作将自动将每个URL的贡献聚合到其链接列表所在的机器上，在那里计算其新排名，并与其链接一起加入。这种跨迭代的一致分区是像Pregel这样专门化框架中的主要优化之一。RDD允许用户直接表达这一目标。



## 4. RDD的表示

为RDD提供抽象的挑战之一是能够支持各种转换。理论上应该提供给用户任意组合，因此我们提出了一种基于图形的简单 RDD 表示形式。我们建议通过一个通用接口来表示每个 RDD，该接口公开五条信息：一组分区，它们是数据集的原子部分；一组对父 RDD 的依赖关系；一个基于其父级计算数据集的函数；以及有关其分区方案和数据放置的元数据。

![image-20250327143412191](http://14.103.135.111:49153/i/6852e3fe7ef52.png)

例如，表示 HDFS 文件的 RDD 为文件的每个块都有一个分区，并且知道每个块位于哪些机器上。同时，此 RDD 上的映射结果具有相同的分区，但在计算其元素时将映射函数应用于父级数据。我们在表 3 中总结了此接口。

| 操作                     | 作用                                           |
| ------------------------ | ---------------------------------------------- |
| partitions()             | 返回一个分区对象列表                           |
| preferreLocations(p)     | 列出由于数据局部性而可以更快访问分区 p 的节点  |
| dependencies()           | 返回依赖的列表                                 |
| iterator(p, parentIters) | 给定分区 p 的父分区的迭代器，计算分区 p 的元素 |
| partitioner()            | 返回指定 RDD 是否为哈希/范围分区的元数据       |

在设计这种接口时，最有趣的问题是如何表示 RDD之间的依赖关系。 我们发现将依赖关系分类为以下两种类型既足够又实用：

1. **窄依赖（Narrow Dependencies）**：
   - 每个父 RDD 的分区最多被**一个**子 RDD 的分区使用。
   - 例如，`map` 操作会产生窄依赖。
2. **宽依赖（Wide Dependencies）**：
   - 多个子 RDD 的分区可能依赖于同一个父 RDD 的分区。
   - 例如，`join` 操作通常会产生宽依赖（除非父 RDD 经过**哈希分区**）。

图 4 展示了其他示例。

![image-20250327154634173](http://14.103.135.111:49153/i/6852e405966cb.png)

HDFS 文件：在我们的样本中，输入 RDD 来自 HDFS 中的文件。对于这些 RDD，`partitions` 方法为文件的每个数据块返回一个分区（每个 `Partition` 对象中存储了数据块的偏移量），`preferredLocations` 方法返回数据块所在的节点，`iterator` 方法用于读取数据块。

- map：在任何 RDD 上调用 `map` 方法都会返回一个 `MappedRDD` 对象。该对象与其父 RDD 具有相同的分区和首选位置，但在其 `iterator` 方法中对父 RDD 的记录应用传递给 `map` 方法的函数。
- union：在两个 RDD 上调用 `union` 方法会返回一个 RDD，其分区是父 RDD 分区的并集。每个子分区通过与对应父 RDD 之间的窄依赖（narrow dependency）进行计算。
- sample：抽样操作与映射操作类似，区别在于 RDD 会为每个分区存储一个随机数生成器的种子，从而对父 RDD 的记录进行确定性抽样。
- join：对两个 RDD 执行 `join` 操作可能会产生两种窄依赖（如果两个 RDD 都使用相同的哈希分区器或范围分区器）、两种宽依赖（wide dependency）或二者的混合形式（如果只有一个父 RDD 使用分区器）。无论哪种情况，输出 RDD 都会有一个分区器（要么继承自父 RDD，要么使用默认的哈希分区器）。

## 5. 实现

系统运行在Mesos集群管理器上，允许其与Hadoop共享资源。每个Spark程序都作为单独的Mesos应用，并且资源管理由Mesos控制。Spark可以从Hadoop输入源（HDFS 或者 HBase），并且运行在原生的Scala上。我们关注几个有趣的部分： Job调度，Spark 解释器运行作为交互使用，内存管理以及支持checkpointing

### 5.1 Job调度

Spark调度采用了第四节介绍的RDD的表示，总的来说，我们的调度器类似于Dryad‘s，但是考虑了哪写分区的RDD在内存可用。每当用户在RDD上运行action（比如count 或 save），调度程序都会检查该RDD的血统以构建要执行的DAG，如图5所示（实线框是RDD，分区时阴影框，如果在内存则为黑色。要在RDD G上action，在宽依赖项处构建构建阶段，并在每个阶段内流水线化窄转换）。每个阶段都包含尽可能多的的窄依赖性的流水线转换，阶段的边界是宽依赖所需的shuffe操作，或者是任何可以缩短父RDD计算的已计算分区。

![image-20250327141702490](http://14.103.135.111:49153/i/6852e41235df4.png)