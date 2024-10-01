# Lec 16 原子、隔离、事务

我们的目标是**用不可靠的组件构建可靠的系统**。我们希望构建能够服务众多客户端、存储大量数据、性能良好的系统，同时保持高可用性。处理故障的高层次过程是识别故障、检测/遏制故障并处理故障。在课堂上，我们将构**建一套抽象方法**，使这个过程更易于管理。

----

**原子性**

```python
def tranfer(bank_file, account_a, account_b, amount):
  bank = read_account(bank_file)
  bank[account_a] = bank[account_a] - amount
  bank[account_b] = bank[account_b] + amount
  write_account(bank_file)  ---- crash!
```

这样做有个问题： 在write_accounts()执行途中crash了，bank_file会处在一个中间状态。

```python
def tranfer(bank_file, account_a, account_b, amount):
  bank = read_account(bank_file)
  bank[account_a] = bank[account_a] - amount
  bank[account_b] = bank[account_b] + amount
  write_account(tmp_file)
  rename(tmp_file, bank_file)   ---crash!
```

实际上rename()途中发生crash潜在地也会让bank_file处在中间状态，知识转移了问题。一个办法是，把rename做成原子的。

----

让rename()变成原子的，要比write_accounts()变成原子的更加可行。为什么？简单回答就是rename操作要比较简小。

这里简单用Unix文件系统为例，介绍相关的数据结构。

目录条目是文件系统中的一个结构，用于将文件名映射到相应的 inode，文件名为 "bank_file" 的文件与 inode 1 相关联。

![截屏2024-07-02 01.44.14](http://198.46.215.27:49153/i/6682eaf3ef974.png)

在这个例子中，我们有三件事情正在发生。

1. 我们需要将银行文件的条目指向新的数据，即指向inode 2
2. 删除有关临时文件的目录条目，因为他的内容已经被转移到了orig_file，删除目录条目意味着再通过tmp_file名字来访问inode2
3. 减少inode1的引用计数。

```python
def rename(tmp_file, orig_file):
    tmp_inode = lookup(tmp_file) 
    orig_inode = lookup(orig_file)
  	# point orig_file's dirent at inode 2
    orig_file dirent = tmp_inode
    # delete tmp_file's dirent
    remove tmp_file dirent
    # remove refcount on inode 1
    decref(orig_inode)
```

我们假设如果执行到``orig_file dirent = tmp_inode``时发生crash，则情况看起来很糟糕，实则无伤大雅，因为**单个**扇区的写操作是原子的。 

但是如果执行到 ``remove tmp_file dirent`` crash了，那么引用计数将会是错误的

---

解决方案： 从失败中恢复(清理干净)。

```python
def recover(disk):
  for inode in disk.inodes:
    inode.refcount = find_all_refs(disk.root_dir, inode)
  if exists(tmp_file):
    unlink(tmp_file)
```

这个方法有个名称， “影子副本”(shadow copy)，将更新数据写入到临时文件，然后原子性地切换到新副本，最后移除旧副本。。有一个可靠的恢复过程意味着系统可以容忍一定程度的中间状态不一致或错误，因为这些问题可以在故障发生后通过恢复过程来修复。这种设计理念简化了系统实现。

>  为什么这种方法可行？

因为我们进行的是单扇区的写入。它需要从较底层获取一些原子性。这实际是原子操作的通用方法。

---

**隔离性Isolation**

隔离性指的是一个操作（A1）的效果如何以及何时对另一个操作（A2）可见。在课程中，我们的目标是实现高度的隔离性，使得 A1 和 A2 看起来像是按顺序执行的，即使它们实际上是并行执行的

事务通过提供**原子性和隔离性**来保护数据一致性，使得系统在处理并发操作和故障时更加可靠和易于管理。事务的这些特性简化了并发控制，减少了手动管理并发和故障恢复的复杂性

![截屏2024-07-02 10.06.55](http://198.46.215.27:49153/i/668360c74ec72.png)

**原子性**：通过影子拷贝实现了单个用户和文件的原子性，但这种方法的性能很差，无法扩展到大规模系统。

**隔离性**：目前还没有实现有效的隔离性。粗粒度锁虽然简单但性能差，而细粒度锁虽然性能好但实现复杂且难以推理。 

