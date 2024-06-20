---
title: 编程基础(Python版)
titleTemplate: 公开课
description: Ron的计算机课堂

layout: doc
sidebar: true
aside: true
# editLink: true
# lastUpdated: true
---

# 编程基础(Python版)

欢迎来到Ron的计算机课堂，我们将踏上学习计算机编程的旅程，这是现代世界中任何人都可以拥有的最有趣、有趣和实用的技能之一。

## 一、目标

这门课多样化的学生群体，不仅在背景方面，而且在未来目标方面也是如此。有些人计划成为软件工程师。有些人对这种职业不感兴趣，但承认在解决自己感兴趣领域的问题时让计算机为自己工作的效用。有些人觉得编程本身很有趣而且有趣。你可能属于这些类别中的一个或多个。无论如何，如果你未来的目标和计划中涉及计算，我们希望对你来说将是一次有趣和有价值的体验！

介绍编程的重要概念，主题包括编程和 Python 基础知识、计算概念、软件工程、算法技术、数据类型和递归。旨在培养将编程语言的基本方法应用于抽象问题的技能。

**编程目标**

- 用"地道"的方式设计实现中小型python程序
- 在你喜欢的编程环境中，实现了测试，调试python程序
- 将编程作为一个工具解决其他领域的问题
- 学会用命令行与你的计算机交互

**思维目标**

- 能够将一个大问题分解成可独立实现，独立调试的小问题。
- 不使用电脑，通过模型图分析，推断出python程序的行为。
- 意识各种算法和数据结构在效率和正确性方面所带来的权衡问题。
- 在编写任何代码之前，预测程序设计中的一些边缘情况和故障模式。

**课程内容**

- 阅读材料
- 复习材料
- 12个实验，每a个实验，都包括软件设计、构建和设计实施
- 复习课

## 参考书

- Python:
  - [Python官方教程](https://docs.python.org/zh-cn/3/tutorial/index.html)
  - [像计算机科学家一样思考python(英文名: Think Python)](https://book.douban.com/subject/26870407/) by Alan Downey


### 通用的阅读资料

- [设计程序](https://py.mit.edu/spring24/readings/design)
- [编程风格](https://py.mit.edu/spring24/readings/style)
- [命令行](https://py.mit.edu/spring24/readings/command_line)

## 主题

- Lec 1: [环境模型](https://py.mit.edu/spring24/readings/environment_model)
- Lec 2: [有趣的函数](https://py.mit.edu/spring24/readings/functions)
- Lec 3: [例子分析：洪流](https://py.mit.edu/spring24/readings/floodfill)
- Lec 4: [图搜索](https://py.mit.edu/spring24/readings/graph_search)
- Lec 5: [递归](https://py.mit.edu/spring24/readings/recursion)
- Lec 6: [递归和迭代器](https://py.mit.edu/spring24/readings/recursion2)
- Lec 7: [回溯](https://py.mit.edu/spring24/readings/backtracking)
- Lec 8: [自定义类型](https://py.mit.edu/spring24/readings/classes)
- Lec 9: [继承](https://py.mit.edu/spring24/readings/inheritance)
- Lec 10: [函数式编程](https://py.mit.edu/spring24/readings/functional_programming)


## 实验

# Lec1 环境模型

## 开头例子

```python
functions = []
for i in range(5):
    def func(x):
        return x + i
    functions.append(func)

for f in functions:
    print(f(12))
```



## 环境图

每当Python需要处理一个对象时，该对象都会存储在内存中；此外，Python还需要一种方法将名称与其存储在内存中的对象关联起来。因此，在我们的图示中，我们需要跟踪两个重要类别的内容：我们需要跟踪正在使用的对象，并且还需要跟踪我们可以用来引用这些对象的名称。在我们的图示中，我们将这两个内容分别保留在两个不同的区域中，这对应于逻辑上分离的内存区域：堆（存储对象的地方）和栈（我们用来跟踪名称的地方）。因此，一个空的环境图通常会从将绘图分成这两个区域开始。

![截屏2024-06-02 05.36.40](http://198.46.215.27:49153/i/665b946c763d3.png)

```python
x = 307
x = 308
y = x
y = 342
```

我们将x称为变量，它绑定到堆上表示307的对象；我们还将箭头本身（表示变量x与其绑定值之间的链接）称为引用。第2行，``x = 308`` 我们看到另一个赋值语句，因此我们以完全相同的方式进行

![截屏2024-06-02 05.33.28](http://198.46.215.27:49153/i/665b93af95538.png)

代表307的对象，它现在孤零零地留在堆上，没有任何指向它的引用。没有指向该对象的箭头意味着我们不再有任何方法从程序中访问它！通过一种称为“垃圾回收”的过程，Python将有效地删除无法再从我们的程序中访问的对象，从而释放出该内存以供以后使用。

Python的垃圾回收过程的实际内部机制相当复杂，但在我们的图示中，我们将通过模仿Python垃圾回收的一个核心方面来简化这一过程：引用计数。Python通过跟踪每个堆上对象的引用数量来实现这一点（在我们的图示中，就是指向每个对象的箭头数量）；当一个对象的引用数量降到0时，Python就会移除它，并释放相关内存以供以后使用

## 列表

```python
mylist = [309, 310, "cat"]
```

![截屏2024-06-02 05.53.43](http://198.46.215.27:49153/i/665b986c930ce.png)

列表的内容（项目）在内存中显式存储为对其他Python对象的引用，而不是对象本身。在这个例子中，我们将列表中的引用绘制成与全局框架中的引用不同的颜色，但这纯粹是为了使图示更易于查看和解释；红色和蓝色箭头表示的含义完全相同。例如，在下面这段代码中，我们最终会得到变量`x`和列表的第一个位置（索引0）都指向同一个对象

```python
x = 309
mylist = [x, 310, "cat"]
```

那如果是 `` x = []``呢？

![截屏2024-06-03 02.19.43](http://198.46.215.27:49153/i/665cb7c40e8d7.png)



### 列表的操作

当我们使用 `mylist[0]` 来索引列表时，Python 首先评估方括号左边的内容，以确定我们要查看哪个对象。在这种情况下，我们通过从全局框架 (global frame) 跟踪引用到内存中的列表对象来评估 `mylist`。然后，方括号中的部分告诉我们查看索引 0，所以我们跟随列表中的第一个引用，找到表示整数 309 的对象.

如果我们对绘制每一步过程非常挑剔，值得注意的是，Python 还会创建一个新对象来表示表达式中的 0，并用它来索引列表。但由于这个 0 会立即被垃圾回收（没有箭头指向它），我们通常会在图示中省略这样的细节

### 列表切片和复制

我们也可以在这里使用负索引，所以 `x[-N:]` 是一种获取 `x` 中最后 `N` 个元素的方法。省略两个参数，如 `x[:]`，给我们一个 `x` 的副本。然而，重要的是，这只是 `x` 的浅拷贝，因为它是一个包含 `x` 中所有相同引用的新列表。`x[::-1]`，它生成一个新列表，其中包含 `x` 中的所有引用，但顺序相反

## 元祖

## 何时使用环境图

## 总结



# Lec 2 函数的乐趣

## 1 抽象的力量

## 2 函数及其环境模型

## 3 函数是一级对象

## 4 Example

```python
functions = []
for i in range(5):
    def func(x):
        return x + i
    functions.append(func)

for f in functions:
    print(f(12))
##结果输出
16
16
16
16
16
```

解释一下原因。

>第一步
>
>![截屏2024-06-03 09.42.27](http://198.46.215.27:49153/i/665d1f89ba981.png)
>
>这是刚开始的状态，运行完第一行。接着，将直接跳到第一次进入循环体，此时全局帧(GF)中，i绑定到0，绑定后结果如图
>
>![截屏2024-06-04 01.36.16](http://198.46.215.27:49153/i/665dff15c53ee.png)
>
>现在我们进入了 for 循环的主体，接下来我们看到的是第 3-4 行的函数定义 (def)。执行这一语句后，我们将在堆中生成一个新的函数对象，并将其绑定到一个名称。
>
>![截屏2024-06-04 01.38.17](http://198.46.215.27:49153/i/665dff9061c57.png)
>
>我们创建了函数对象并存储了相关信息。因为我们仍在全局帧中运行，所以这个新函数的封闭帧(enclosing frame)是全局帧，并且名称 func 也绑定在全局帧。
>
>![截屏2024-06-04 01.50.55](http://198.46.215.27:49153/i/665e0284b03f2.png)
>
>到此为止，我们已经到达了 for 循环体的底部，因此我们准备继续下一次迭代。在下次循环时，我们的循环变量 i 将绑定到我们正在循环的 range 对象中的下一个元素
>
>![截屏2024-06-04 01.53.03](http://198.46.215.27:49153/i/665e0305e4380.png)
>
>在第二次循环中，`i` 已经在全局帧中重新绑定为 1。而且由于之前的 0 没有引用指向它，它被垃圾回收了。 因为我们创建的函数从未访问过 `i` 以找到 0 的值；它只是存储了一个指令，当被调用时，它应该查找 `i` 并将其相关值添加到其参数中（它不知道在定义时 `i` 是 0，因为我们从未访问 `i`）
>
>![截屏2024-06-04 01.57.12](http://198.46.215.27:49153/i/665e041221a6d.png)
>
>所以这个图表代表了我们完成循环后的程序状态。这个图表有点复杂，但我们可以总结一些会影响我们输出的关键点：
>
>- 名称 `i` 在全局帧中绑定到值 4（即使在我们退出循环后，这个绑定仍然存在）
>- 我们在 `functions` 列表中有五个不同的函数对象
>- 每个函数都有相同的函数体，执行该函数体涉及查找 `i`
>
>在这里，我们将 `f` 绑定到了我们列表中索引 0 处的函数对象。一旦完成这个绑定，我们就准备好执行 for 循环的主体了。在这里，我们将要进行一个函数调用 `f(12)`，首先我们将访问表达式 `f` 以确定要调用的函数，并evaluate 12 以确定要传递的值
>
>![截屏2024-06-04 02.06.33](http://198.46.215.27:49153/i/665e062fb6767.png)
>
>现在我们知道了我们要调用哪个函数，以及需要传给这个函数什么值，下一步就是建立新的帧(以及设置他的父指针)。**更新图示，包含一个新帧，并将其父指针指向我们要调用的函数的封闭帧**
>
>![截屏2024-06-04 02.01.25](http://198.46.215.27:49153/i/665e04fb0f171.png)
>
>继续往下，我们有自己的新帧（打上F1标签），下一步就是将函数的参数（这个例子就是x)绑定到传入的参数值。
>
>![截屏2024-06-04 02.03.29](http://198.46.215.27:49153/i/665e057619215.png)
>
>在F1中查找x，我们找到了局部绑定的12。但是i在局部没有绑定。那么我们该怎么办呢？我们遵循父指针，发现全局帧中有i这个名称。它引用了i的值为4，所以我们将使用它。
>
>然后我们将这两个值相加，得到一个表示16的新的整数对象，我们将其返回。
>
>我们将在这里停下来，但请注意，无论我们调用这些函数对象中的哪一个，结果都将是相同的。它们都不记得i在创建时的值；它们只是简单地说要查找当前i的值并将其添加到它们的输入中！因此，当我们继续循环并依次调用这些函数对象时，它们都会产生相同的输出！



## 5 闭包

可以想象，写下那段代码的人并不打算看到五个16，而是希望看到一些不断变化的数字。

**函数对象“记住”了它被定义的帧（其封闭帧）**，因此，当函数被调用时，它可以访问在该帧中定义的变量，并可以从其自身的主体中引用它们。我们将一个函数和它的封闭帧的组合称为闭包，事实证明这是一个非常有用的结构

> 为了解释这个，我们举个例子
>
> > 
>
> ```python
> x = 0
> def outer():
>   x = 1
>   def inner()
>     print('inner:', x)
>   inner()
>   print('outer: ', x)
> print('global:', x)
> outer()
> inner()
> print('global:', x)
> ```
>
> 我们在这里定义了一个函数``inner``，在另外一个函数``outer``里面。创建一个新的函数对象，但尚未evaluate其中任何代码
>
> ![截屏2024-06-04 04.19.14](http://198.46.215.27:49153/i/665e25499a7d3.png)
>
> 新的函数对象将具有一个指向封闭帧的指针，该帧指针指向全局帧，因为我们在创建这个对象时是在全局帧中运行的。
>
> ![截屏2024-06-04 04.23.28](http://198.46.215.27:49153/i/665e2645a15a2.png)
>
> 并且def还将outer与该函数进行了关联。接着，我们需要evaluate并打印x。因为x=1还没执行，第一次输出结果是global: 0
>
> 接着我们准备执行outer。首先，我们确定我们要调用哪个函数。我们在全局帧中evaluate `outer`，找到了我们刚刚创建的函数对象。
>
> 然后我们也会评估参数，但在这种情况下没有参数，所以我们直接进入下一步。
>
> ![截屏2024-06-04 04.30.23](http://198.46.215.27:49153/i/665e27e46dd80.png)
>
> 所以我们现在可以继续评估函数的主体，位于帧 F1 内。我们首先遇到的是 x = 1，所以我们评估这个 1，得到一个新的整数，并将其与 F1 中的 x 关联起来。我们在创建此函数对象时所在的帧是哪个？我们是在 F1 中evaluate这个 def inner。因此，这个函数的封闭帧不是全局帧，而是 F1
>
> ![截屏2024-06-04 04.35.19](http://198.46.215.27:49153/i/665e290ebc1a8.png)
>
> 最后，我们将在evaluate时关联帧 F1 中的变量 inner 与该新函数对象
>
> ![截屏2024-06-04 04.36.08](http://198.46.215.27:49153/i/665e293ddf64d.png)
>
> 接着我们准备调用inner()，还是按照相同步骤，我们首先evaluate我们想要调用的函数，并寻找我们刚刚建立的函数（就是最右下方那个），然后evaluate参数——这里没有参数。 现在我们要新建F2，这个帧需要父指针指向哪里？
>
> ![截屏2024-06-04 04.40.03](http://198.46.215.27:49153/i/665e2a295de12.png)
>
> ![截屏2024-06-04 04.43.22](http://198.46.215.27:49153/i/665e2aeeb76dc.png)
>
> 那个右下角函数的父指针指回到 F1。这就是新帧 F2 也指回 F1 的原因。接下来，我们会将参数的名称绑定到传入的参数，但这里没有参数.在新帧 F2 中运行时，我们看到 print("inner:", x)，所以我们在 F2 中查找 x。我们在 F2 中找不到 x，所以我们追溯到其父帧 F1，并发现 x 绑定到 1。（请注意，我们没有到达全局帧，在那里 x 是 0。我们必须跟随父指针，并在第一个定义 x 的帧处停止。）
>
> 我们完成了使用 F2 的对 inner() 的函数调用，所以我们可以对其进行垃圾回收，并回到 F1 中继续评估 outer 的主体。
>
> 现在我们评估 print('outer:', x)。查找 x 找到值 1，所以我们打印：outer: 1
>
> ![截屏2024-06-04 04.48.31](http://198.46.215.27:49153/i/665e2c26e2d12.png)
>
> 现在我们已经完成了对 outer() 的调用，因此我们也可以清除 F1，以及我们创建的内部函数对象。。我们继续执行下一行代码，其中要调用 inner()。但请注意，我们又回到了全局帧中——在这里，事实证明没有叫做 inner 的东西！这将导致一个错误，一个 NameError，表示 inner 未定义。请记住，inner 只存在于帧 F1 中，而不是我们现在所处的全局帧中。
>
> ![截屏2024-06-04 04.51.25](http://198.46.215.27:49153/i/665e2cd54140f.png)
>
> 但是有一些有趣的行为正在发生，让我们回到这个过程的中间步骤，当所有的帧和函数对象仍然存在，并且我们正在调用这个 inner() 函数时。
>
> 当我们创建 inner 函数时（在右下角用绿色复选标记标记），它的父引用指回到 F1，与调用 outer 相关的帧。
>
> 因此，无论何时我们调用这个函数，我们为该调用创建的帧都将其父帧设置为 F1。所以这个 inner 函数，无论何时我们调用它，都可以访问父帧中的所有变量。
>
> 因此，将这个内部函数对象视为一个独立的对象以外，还可以将其视为函数和创建它的帧（其“封闭环境”）的组合作为单个实体，我们在这里用绿色圈圈出来。为什么呢？因为该函数可以访问父帧中定义的所有变量。这个实体就是我们所说的闭包——函数对象和其封闭环境的组合。

上面这个例子说明了什么闭包。但是我们仍然对闭包的用法还不是太了解，下面再举个实用的例子

>```python
>def add_n(n):
>  def inner(x):
>    return x + n
> 	return inner
>
>add1 = add_n(1)
>add2 = add_n(2)
>
>print(add2(3))
>print(add1(7))
>print(add_n(8)(9))
>```
>
>当我们调用 add_n(1) 时，它最终会在一个新帧中将 n 绑定到 1，并创建一个捕获该帧的函数对象。这个函数最终绑定到 add1。因此，add1 将是一个将 1 添加到我们传递给它的任何值的函数。（记住 add_n 的返回值是一个函数，所以我们存储在 add1 中的是一个我们可以调用的函数。）
>
>![截屏2024-06-04 06.53.03](http://198.46.215.27:49153/i/665e4954b5464.png)
>
>现在我们在 `add_n` 的函数体中最后要做的事情是返回 `inner`。我们将通过指向我们刚刚创建的函数对象来表示返回值。
>
>![截屏2024-06-04 06.54.51](http://198.46.215.27:49153/i/665e49c090417.png)
>
>将add1 绑定到全局帧，并且与刚刚的返回值做关联
>
>![截屏2024-06-04 06.55.16](http://198.46.215.27:49153/i/665e49dd54c52.png)
>
>当我们完成并返回一个函数调用时，比如 `add_n`，这个函数调用及其相关的帧都会消失（并且一大堆东西会被垃圾回收）。
>
>但是在这里，我们不能这样做！我们不能摆脱 F1。为什么呢？因为，从全局帧来看，我们有一种方式可以访问这个函数对象（`add1` 指向它），而这个函数对象依赖于帧 F1。它仍然需要使用帧中的值，所以帧不能被丢弃（而 Python 也不会丢弃它）。
>
>这个整体——函数对象及其封闭环境，被我们称为闭包（closure），我们可以把它看作一个单一的实体，一个可以依赖于在封闭帧中定义的变量的函数。
>
>当你调用 `add1` 函数对象，因为全局帧中的 `add1` 指向那个函数对象，它可以访问 n(因为我们创建函数时 n 就被绑定为 1）。所以每次我们调用这个函数并运行它的主体 `return x + n` 时，它会将 n 的值视为 1。这就是为什么这个函数总是会将传入的值加 
>
>![截屏2024-06-04 07.04.56](http://198.46.215.27:49153/i/665e4c1e3e1d6.png)
>
>接着我们调用``add_n(2)``，因此新建F2帧，其n绑定到2，它的父指针指向GF。
>
>![截屏2024-06-04 08.58.14](http://198.46.215.27:49153/i/665e66acc6c17.png)
>
>现在我们已经在全局框架中将 `add2` 绑定到这个第二个函数对象。
>
>通过当前状态的图表，我们可以看到将一个函数与其封闭框架作为一个整体绑定是多么有用。我们现在称为 `add1` 和 `add2` 的这些函数（在全局框架中）做了不同的事情。一个将传入的值加1，另一个加2。但如果仅仅查看它们的函数对象本身——参数和主体——它们看起来是一样的！区别它们的关键在于它们的封闭框架，它们绑定了不同的 n 值
>
>![截屏2024-06-04 09.00.02](http://198.46.215.27:49153/i/665e67181a041.png)
>
>记住我们的规则是新帧的父框架来自于函数对象的封闭帧——即定义该函数的帧。因为我们调用的函数是在 F2 中定义的，所以 F3 指向 F2。
>
>这很重要！这就是它获取正确的 n 值的地方。因为现在我们执行函数对象的主体 `return x + n`，它发现 x 在 F3 中绑定为 3，n 在 F2 中绑定为 2，并返回 5。
>
>![截屏2024-06-04 09.13.52](http://198.46.215.27:49153/i/665e6a57cbae5.png)









# Lec 3 洪水填充和迷宫路径查找

## 1 一些有用的特性

### 1.1）内置函数``zip``

``zip是一个非常方便的Python内置函数，它使我们能够轻松地在多个可迭代对象中找到对应的元素。（“可迭代”意味着我们可以使用for循环来遍历它们的所有元素。）例如，考虑以下代码，它用于执行两个列表的元素级减法操作

```python
def substract_lists(l1, l2):
  assert len(l1) == len(l2)
  out = []
  for ix in range(len(l1)):
    out.append(l1[ix] - l2[ix])
  return out
```

我们可以使用Python内置函数zip以稍微不同的方式来解决这个问题。zip函数接受多个可迭代对象作为输入，并返回一个可以迭代的结构。在使用zip重写上面的subtract_lists之前，让我们先看一个小例子，以便熟悉zip函数

```python
x = [100, 200, 300, 400]
y = [9, 8, 7, 6]
print(zip(x, y)) # prints <zip object at SOME_MEMORY_LOCATION>

```

这看起来本身并不是很有用，但zip对象的存在是为了被迭代。

```python
for element in zip(x, y)
	print(element)
### output
(100, 9)
(200, 8)
(300, 7)
(400, 6)

```

### 1.2） 元组解包

```python
# example
i, j = (100, 9)

```

我们重写上面列表减法的例子

```python
def substract_lists(l1, l2):
  assert len(l1) == len(l2)
  out = []
  for i, j in zip(l1, l2):
    out.append(i - j)
  return out
```

### 1.3）``*``解包

``get_pixel(image, row, col)``返回（row, col）位置的颜色。函数期望行和列作为单独的参数传递，但是我们的代码将处理由两个元素组成的 (row, col) 对，例如 location = (23, 11)。我们可以使用解包运算符 * 来提取对中的各个部分并将它们作为单独的参数传递

```python
get_pixel(image, *location)
# 与下面的例子相同
get_pixel(image, localtion[0], location[1])
```

与元组解包类似，我们不仅可以在元组上使用这个运算符，还可以在列表上使用，而且元组或列表的长度可以是任意的。但是，如果长度不对，导致我们试图向函数传递错误数量的参数，那么 Python 就会引发错误。

### 1.4) 列表推导

我们想要根据其他列表的内容构建数据。比如 L=[9, 8, 7]，我们想要建立一个新的列表，以L的奇数位数字加倍形成。

```python
out = []
for num in L:
  if num % 2 == 1: # if num is odd
    out.append(num * 2)
```

可以写成

```python
out = [number * 2 for number in L if number % 2 == 1]
```

而且支持将多个for循环放到列表推导式里面

```python
out = []
for x in <sequence of x>:
  if <condition on x>:
    for y in <sequence of y>:
      if <condition on y>
      	out.append(<some expression using x, y>)
```

可以改写成

```python
[
  <some expression using x, y>
  for x in <sequence of x>
  if <condition on x>
  for y in <sequence of y>
  <condition on y>
]
```

在列表推导中，if 后面可以跟 else 或 elif 吗，就像普通的 if 语句一样？事实证明答案是**否定的，因为这个 if 的目的是过滤结果列表——如果条件为真则产生一个元素，但如果条件为假则完全省略它。在需要 else 行为的情况下，您需要将它放在前导表达式中，使用 Python 的“一行 if”语法（也称为条件表达式或三元运算符）：

```python
[  <some expression> if <some_condition> else <other expression>
  for x in <sequence of x> ]
```



## 2 洪水填充

## 3 Debugging

## 4 迷宫路径查找

# Lec4 图搜索

抽象路径搜索

BFS vs. DFS

## 总结

再次感觉我们已经走了很长的一段路。我们从回顾上周的示例问题洪水填充开始，然后扩展和形式化，最终得出图搜索的概念。在今天的阅读中，我们探讨了图搜索算法的几个方面。一开始，我们从抽象的角度谈论图搜索，包括讨论更改议事日程中考虑元素顺序所产生的行为巨大差异。我们还看到了几个将现实世界中的问题表示为图形的示例。

# Lec5 递归

我们将进入一个新主题：递归。递归在没有一定经验和对其工作原理有一定了解之前可能会感觉有些奇怪和不舒服。因此，我们花费大量时间来实现这个目标：培养对递归的熟练和舒适感，以及更深入的理解。我们将从几个不同的角度来探讨这个问题——除了会看看我们如何在自己的程序中使用递归，也将重点介绍递归在幕后是如何工作的（就我们的环境模型而言），以及我们如何决定是否递归解决方案适用于给定问题（或者是否其他方法可能更好）。如果递归感觉奇怪或不舒服，不用担心；这是一种自然的第一反应，随着时间和实践，这个想法将不再那么可怕，并开始成为我们可以在自己的程序中使用的非常强大的工具。

当函数根据自身定义时，就会发生递归

下面看这个例子，对于非负整数n，有
$$
n! = \begin{cases} 1 & \text{if } n=0 \\ n \times (n-1)! & \text{otherwise} \end{cases}\
$$
通常来说，一个递归的定义分为两个部分：

- 1个或多个基本情况（就是不需要通过递归就得到答案）
- 1个或多个递归情况（可减少到基本情况的规则集）

代入一个具体数值，我们有

![截屏2024-06-19 23.36.05](http://198.46.215.27:49153/i/6672faf1c4e88.png)

----

用python实现，

```python
def factorial(n):
  if n == 0:
    return 1
  else:
    return n * factorial(n-1)
  
```

在我们继续深入探讨这在 Python 中是如何运作之前，有必要再次提到，根据您先前接触这些概念的程度，编写这样的函数可能会让人感到不舒服。而这里的一个很大的怪异之处在于，当我们编写阶乘函数时，我们在主体中使用了阶乘，尽管我们尚未完成编写阶乘！但是，正确的策略是在假设您有一个完整、可运行的函数版本的前提下编写递归情况，并思考在这些条件下，我如何从递归调用的结果中获取并与其他内容结合以生成我感兴趣的结果？这里我们不需要盲目相信；如果我们设计得当，已经设置了基本情况，并且我们的递归调用朝着这些基本情况的一个递减的方向工作，那么事情将为我们顺利进行。这里另一个奇怪之处在于，在评估对阶乘的某次调用的过程中，我将需要再次调用阶乘，可能会有很多次；而每次调用都有自己的 n 值。所以，我们如何确保 Python 会将这些内容分开并且不会混淆？

----

## 递归的环境模型

## 



这表明，递归子问题可以以比数值参数或列表参数的大小或简单性更微妙的方式变得更小或更简单。我们仍然通过将问题从所有可能的整数减少到仅正整数的方式有效地减少了问题。接下来的问题是，假设我们有一个正整数n，比如说n = 829（十进制），我们应该如何将其分解为一个递归子问题呢？想想这个数字，就像我们在纸上写下来的那样，我们可以从8（最左侧或最高位数）或9（最右侧或最低位数）开始。从左边开始似乎很自然，因为那是我们写的方向，但在这种情况下会更困难，因为我们首先需要找到数字的位数以确定如何提取最左边的数字。相反，将n分解为取余b（得到最右边的数字）和除以b（得到子问题，剩下的更高位数数字）的方式更好：

## 总结

- 每个递归函数都有1个或多个基本情况，1个或多个递归情况
- 递归情况应该让问题变得越来越小或者是越来越简单

# Lec 8 递归和迭代器

递归通过在更小或更简单的子问题上递归调用同一个函数重复计算。迭代器这是通过for和while循环来重复运算。那如果我想出一个可迭代的版本，那我还需要用递归吗？ 不需要。 任何能够写成递归的函数，都能写成迭代器版本。我们可以用循环迭代编写的任何函数，也可以用递归方式编写。重要的是，能够以两种方式思考，并选择对最自然和最合适的方式进行思考。

我们从这个例子出发
$$
n! = \begin{cases} 1 & \text{if } n=0 \\ n \times (n-1)! & \text{otherwise} \end{cases}\
$$
或者
$$
n! = \prod_{i=1}^{n} i
$$
第一个定义是递归的，但是第2个是迭代的。根据定义直接翻译成代码就是

```python
def factorial(n):
  if n == 0:
    return 1
  else:
    return n * factorial(n-1)
```

```python
def factorial(n):
  out = 1
  for i in range(1, n+1):
    out *= i
  return out
```

以下是两个的比较

- 迭代版本可能更加高效因为他不需要为递归调用创建新的帧
- 递归版本感觉更简单，更加符合数学定义
- 这两个版本对于不合法的输入可能表现有所不同，比如n < 0

在python中，默认的调用栈深度是1000，超过了会报RecursionError。

----------

**列表模式**

剩下部分看一下几个重复计算的常用类型，取决于数据类型，比如列表类型，树类型和图类型。

下面看一下sum_list的迭代和递归实现方式

```python
def sum_list(x):
  sum_so_far = 0
  for num in x:
    sum_so_far += num
  return sum_so_far
```

```python
def sum_list(x):
  if not x:
    return 0
  else:
    return x[0] + sum_list[x[1:]]
```

**使用辅助函数积累结果**

- iterative version: start with `0`, then add `x[0]`, then `x[1]`, then `x[2]`, ..., finally add `x[n-1]`
- recursive version: start with `0`, then add `x[n-1]`, then `x[n-2]`, then `x[n-3]`, ..., finally add `x[0]`

递归版本将添加项保存起来，以便在重新组合步骤时将递归子问题的结果结合。但是，我们不必这样写。我们可以写一个递归版本，通过定义一个递归辅助函数，将到目前为止计算的部分和传递给它，这样就可以进行加法。

```python
def sum_list(x):
	def sum_helper(sum_so_far, lst):
    if not lst:
      return sum_so_far
    else:
      sum = lst[0]
      rest = lst[1:]
      return sum_helper(sum_so_far + num, reset)
  return sum_helper(0, x)
```

sum_helper函数是一个递归辅助函数。它需要与原始sum_list不同的函数，因为它有一个新参数sum_so_far，用于跟踪到目前为止计算的部分总和。递归调用稳定地添加到sum_so_far，直到最终达到列表的末尾（基本情况），此时完成的总和作为唯一结果返回。sum_list的主体通过以0为sum_so_far的初始值调。

----

**优化**

在Python中列表型递归会有几个性能问题

- 每次递归调用创建新帧，递归深度游限制。但是对于二分法，这就不是个问题了
- 在第一个/剩余分解中，每个递归调用都需要复制列表的其余部分，使用像lst[1:]这样的片段。在整个计算过程中，所有这些复制相加的时间都与列表长度的平方成正比。（为什么？如果原始列表的长度为n，则第一个调用将复制长度为n-1的片段，下一个递归调用将复制长度为n-2的片段，依此类推直到达到列表的末尾。由于(n-1)+(n-2)+...+1 ={n(n-1)/2，这意味着花费了O(n^2)的时间来复制。）

这些可以通过几个优化解决

- 递归深度限制可以通过尾递归优化来解决。如果递归被写成这样，即递归调用是函数主体中执行的最后一件事 -- 就像上面的 sum_list 递归版本中的返回 sum_helper(...) 一样 -- 那么这个递归调用被称为尾调用，因为它恰好在函数必须完成的工作的最后做出。 尾递归优化意味着，当运行时系统遇到尾调用时，它推断出它将不再需要当前调用的帧，并且可以简单地为新的递归调用重用它，而不是创建一个新的帧。通过尾递归优化，对 sum_helper 的每个递归调用都只是重用相同的帧，递归深度永远不会超过 1，递归版本的性能基本上就像一个循环。 尾递归优化不能应用于不在函数的最末端的递归调用。如果 sum_list 被编写成我们最初的样子，即返回 x[0] + sum_list(x[1:])，那么这不是尾调用，因为函数仍然需要在递归调用返回后做一些工作（添加 x[0]）。如果需要保留创建的函数对象的帧，则也会阻止尾递归优化。不幸的是，Python 没有实现尾递归优化，但其他语言却有。

- 列表复制问题可以通过实现一个链接表解决，一个列表剩下的内容可以通过常数时间获得，但是python并没有这种结构，因此另外的一个方法避免复制列表，就是使用索引代表剩下的列表比如

  ```python
  def sum_list(x, i=0, sum_so_far=0):
    if i >= len(x):
      return sum_so_far
    else:
      return sum_list(x, i+1, sum_so_far + x[i])
  ```

-----

## 树形模式

树形模式数据，可能会反问任意深度的数据。 例子如下

```python
def sum_nested(x):
  """
  >>> sum_nested([[1, 2], [3, [4, 5]], [[[[[6]]]]]])
  21
  """
  if not x:
    return 0
  elif isinstance(x[0], list):
    return sum_nested(x[0]) + sum_nested(x[1:])
  else:
    return x[0] + sum_nested(x[1:])

```

为什么我们认为 sum_nested 的输入呈树状？因为 x 中的每个子列表就像是树的内部节点，具有可能进一步是子列表的子节点，直到我们到达简单数字，它们就是叶子。树状数据具有直观的递归分解，反映了树结构：我们对所有子节点进行递归调用，直到到达叶子。但请注意，这里编写的 sum_nested 不仅递归地分解了树结构，还递归地分解了子节点列表。

## 图形模式

# Lec 9 递归回溯



## 总结

本章节我们重点学习了称之为回溯的一种特殊的递归结构，这种结构一般包括以下部分：

- 表示一个可能的“成功”的基本情况。
- 表示“失败”的基本情况
- 递归情况，区分这些情况以尝试子问题的不同可能性的一部分（例如，向混音带中添加一首歌曲或在数独中放置一个数字）。如果这种改变在递归调用中导致失败，我们尝试下一个可能性；只有当所有可能性都失败时，我们才会表示失败。

我们在本文中看到这种方法应用于两个不同的问题，并且我们看到它实际上是在实现深度优先搜索，Python 中正常的堆栈帧跟踪机制扮演着我们迭代图搜索程序中“待处理列表”角色的作用。

# Lec 10 自定义类型

从这节开始，我们探讨一下类(class)，提供一种自定义类型的机制，这种机制能将这些自定义类型整合到 Python 语言中。下面从两个方面讲解

- 环境模型
- 实现原理

引入**抽象**概念是作为控制复杂度。我们在Lec2 函数的乐趣中， 我们介绍了一种思考复杂系统的框架，它涉及：

- **原语**：系统由哪些最小和最简单的构建块组成？

- **组合方式**：我们如何将这些构建块组合在一起，构建更复杂的复合结构？

- **抽象手段**：我们有哪些机制可以将那些复杂的复合结构视为构建块本身？

我们从思考**原语**开始：我们必须使用的内置在系统中东西是什么？然后，我们可以考虑如何将这些部分组合在一起，以制作更复杂的东西。最后，要理解真正的能力最终是来自于**抽象**：我们可以拿一个任意复杂的部分，给它画一个框，给它一个名字，然后将它视为基本部分（与其他部分组合，抽象掉这些部分等）。

在这种情境下，我们可以考虑**原语**操作，包括算术（+，*等），比较（==，!=等），布尔运算符（and，or等），内置函数（abs，len等），等等。然后，我们可以通过条件语句（if，elif，else），循环结构（for和while），和复合函数（f(g(x))）将这些东西结合在一起。当我们将这些小的操作结合一起来表示一些新操作后，我们可以将这些新操作的细节抽象出去，并通过使用def或lambda关键字定义函数，将它们当作从一开始就内置到Python中的东西来对待。

python还提供了一些机制来创建我们自己的数据类型，那就是class，该关键字为我们提供了一个很好的方法来创建我们自己的数据类型，并将它们紧密集成到Python中，使其行为就好像它们一开始就内置在Python中一样。

## 环境模型

为了方便理解环境模型，我们会从非惯用的class用法开始分析，不断增加复杂度。

首先看一个例子， 二维向量。 当我们创建了类，我们就可以创建这个类的实例来表示二维向量。下面是最简单类。

```python
class Vector2D:
  pass
```

``class``关键值就做了两件事

- 在堆海上创建了一个对象表示这个类
- 在我们遇到类关键字时，它将该类对象与帧中的名称（即Vector2D）关联起来。

当我们运行上述代码时，我们从全局帧(global frame)开始，第一条语句就是class的定义，因此他会创建一个新的类对象，我们用一个框来表示（跟函数一样），不同的是，我们需要给他带上标签class帮助我们跟踪。在创建新的类对象之后，Python 接下来执行类的body中的代码（以一种特定的方式进行，我们很快会详细说明）。 这里我们的类体只是 pass，所以没有什么可做的。最后将新的类对象与在全局帧的名称Vector2D关联起来

![截屏2024-06-21 09.14.28](http://198.46.215.27:49153/i/6674d3fac2cd6.png)

值得注意的是，尽管我们将类对象以类似于绘制函数对象的方式绘制，但类没有enclosing frames。我们仍然在类的右上角上画一个小标签，但这将具有不同的含义，我们稍后将更详细地讨论。

接下来，当我们用一下语句创建类的实例

```python
v = Vector2D() 
```

Python首先评估括号左侧的内容，以确定我们将要调用哪个对象。在这种情况下，这是通过跟踪名称Vector2D得到的，即我们刚刚在上一步中创建的类对象。在Python中，当我们使用这种语法调用一个类对象时，Python会通过创建一个代表该类的实例的新对象来继续。

我们用类似的框来表示这个实例，加上instance标签，每个实例还会保存这个类的引用，并且与名称v进行关联，得到

![截屏2024-06-21 09.20.51](http://198.46.215.27:49153/i/6674d57a1c0f5.png)

接下来我们用

```python
v.x = 3
v.y.= 4
```

当执行第一个语句时， 我首先会在heap中创建一个int 3的对象， 找到对象 `v` 引用的对象，在获得对象之后，Python 会在这个对象的内部将名称 `x` 与3相关联。得到的结果如图。

![截屏2024-06-21 09.36.48](http://198.46.215.27:49153/i/6674d93cb7319.png)

我们称这种关联（在实例对象的内部，而不是一个帧）称为这个对象的属性。

----

继续看下面例子

```python
class Vector2D:
	pass
v = Vector2D()
v.x = 3
v.y = 4

def magnitude(vec):
  return (vec.x**2 + vec.y**2) ** 0.5

magnitude(v)
```

我们观察如何求解magnitude(v) ，首先我们求解v，得到我们刚刚创建的实对象（有属性x和y），然后我们知道了我们将要传入的参数。

![截屏2024-06-21 10.12.40](http://198.46.215.27:49153/i/6674e1a05a9c6.png)

我们知道调用函数就是创建新的帧。但是我们还没有标注它的父指针指向哪个？因为我们调用的这个函数有全局帧作为它的enclosing封闭环境，所以全局帧就是F1的父指针。因为我们已经创建了新帧，现在我们已经设置好了我们的框架，下一步是在新帧上将函数的参数绑定到传入的参数上。



![截屏2024-06-21 10.16.16](http://198.46.215.27:49153/i/6674e2795cc05.png)

函数的参数``vec``指向我们传入的参数（即在全局帧中称为``v``的实例），做完这些以后，就可以运行函数体了

![截屏2024-06-21 10.24.35](http://198.46.215.27:49153/i/6674e46acb37a.png)

到这里， 这里我们跳过了中间值的创建和垃圾回收。

----

**回看一下代码**

```python
class Vector2D:
	pass
v = Vector2D()
v.x = 3
v.y = 4

def magnitude(vec):
  return (vec.x**2 + vec.y**2) ** 0.5

magnitude(v)
```

值得注意的是，这个函数（magnitude）不仅限于仅在 Vector2D 类的实例上运行；它可以适用于任何具有属性 x 和 y，这两者都指向数字的对象。这是一种名为“鸭子类型”的哲学，它来自这样一个思想：如果某物看起来像鸭子，嘎嘎叫起来像鸭子，那么把它当作鸭子是可以的；在这种情况下，如果某物看起来像向量，像向量一样（具有包含数字的属性 x 和 y），那么可以用这个函数。与其他方法相比，对这种方法有不同的看法（有些语言可能更严格地处理类型），但 Python 通常在这类事情上非常灵活。

然而，很明显，这个函数应该与 Vector2D 类一起使用。但就目前而言，在代码方面它们实际上并没有任何连接。从代码清晰度的角度来看，让 magnitude 函数（用于与 Vector2D 实例一起工作的）与 Vector2D 有某种关联会很好。也许我们可以通过将函数命名为 vector_magnitude 来使这种关系更清晰，但即使如此，这种关联也相当弱。然而，Python 为我们提供了更明确的方法来指示函数（或者确切地说，任何数据）与特定类相连的方式：将代码作为类体的一部分包括在内。因此，让我们对代码进行一点小改动，将 magnitude 函数的定义放在 Vector2D 类的主体内部（我们还将为说明添加另一个部分，表明我们向量的维度）:

```python
class Vector2D:
  ndims = 2
  def magnitude(vec):
    return (vec.x**2 + vec.y**2) ** 0.5
v = Vector2D()
v.x = 3
v.y = 4
```

Python看到类定义时，像以前一样创建一个新的空类对象。但是，然后，Python会运行类定义的主体，遵循一些特殊规则：

- 我们在该定义中绑定的任何名称都将作为类的属性创建，而不是作为帧中的变量。
- 当我们在类定义体中查找一个名称时，优先查找已定义的类属性，如果名称在类属性中不存在，我们接下来会在定义类时所处的作用域中查找这个名称

请注意，这些规则仅在求解我们正在创建的类的body时适用；以后我们将有不同的名称查找规则。下面我们用环境图进行分析。

类定义，在堆区创建一个类框，接着往下执行类body，同样的，我们给类框内的属性ndims与代表2的int 对象 进行绑定，因为这是发生类定义里面的，因此只作为全局帧的变量。再后面是magnitude的定义。

![截屏2024-06-21 11.03.26](http://198.46.215.27:49153/i/6674ed8462406.png)

以下是函数定义的结果，需要提及的是

- ``magnitude``是绑定在类对象的属性，不是全局帧的变量
- 但是， 函数的封闭帧(我们)却仍然在全局帧

这可能感觉有些奇怪，但以这种方式运作是至关重要的，我们将看到一些为什么事情需要以这种方式运作的例子。现在我们已经创建了这个函数对象，我们来到了类定义的底部，并且完成了构建类对象的步骤。接下来的步骤是将该类与全局帧中的名称Vector2D相关联，我们将在下一步展示。

![截屏2024-06-21 11.08.22](http://198.46.215.27:49153/i/6674eeafd68ec.png)

类定义后面执行步骤跟前面的例子相同，这里不再赘述，直接给出最终的环境图

![截屏2024-06-21 11.13.23](http://198.46.215.27:49153/i/6674efdd241af.png)

-----

**调用方法**

常见的调用方法的方式是``v.magnitude()``，这种调用方式会产生与我们之前调用的Vecotr2D.magnitude(v)相同的结果。这有点奇怪，我们似乎在没有参数的情况下调用了它。Python实际上在进行一些魔术以使事情变得这样。实际细节有些复杂，但我们可以这样想Python在做什么：**当我们通过实例查找方法时，Python会找出它是一个实例的哪个类，然后在该类中查找给定的方法，然后隐式地将该实例作为第一个参数传递进去**。因此，我们可以认为这是一种转换，其中调用 v.magnitude() 被转换为 Vector2D.magnitude(v) 。

![截屏2024-06-21 11.19.54](http://198.46.215.27:49153/i/6674f1623d87d.png)

值得一提的是，这并不是实际发生在后台的情况。但对于大多数应用程序来说（实际细节足够复杂！），这是一种非常近似的解释，但我们只需要这样理解就够了，因为真的足够复杂。 广义地说，如果我们通过该类的实例查找类方法，那么我们用于查找的实例将被隐式传递为第一个参数。由于这个过程发生在实际调用方法之前，所以无论我们使用 Vector2D.magnitude(v) 还是 v.magnitude() ，实际调用给定方法的过程的环境图表示都是相同的；它们都导致如下所示的图

![截屏2024-06-21 11.22.00](http://198.46.215.27:49153/i/6674f1e013db3.png)

> [!IMPORTANT]
>
> print(v.magnitude(v)) 会发生什么？
>
> A: TypeError: Vector2D.magnitude() takes 1 positional argument but 2 were given

-----

``self``**的本质**

如果你以前用过 Python 的类，你可能会对这里缺少一个常见的词感到惊讶。通常，当你在“真实世界”中看到 Python 代码时，类方法会有一个名为 `self` 的第一个参数。但是在这里，`self` 是缺失的。我们将简要讨论一下 `self` 的本质。 实际上，它不是一个关键字，也不是一个内置对象或类似的东西。它只是一个用来命名方法的第一个参数（完全是一种**命名惯例**）

这里澄清了 `self` 并不是 Python 中的特殊关键字或内置对象，而只是一个非常强烈的命名惯例，用来指代类实例的方法的第一个参数。

当我们该写成

```python
class Vector2D:
  ndims = 2
  def magnitude(self):
    return (self.x ** 2 + self.y ** 2) ** 0.5
```

对我们的程序没有实际的影响，只是将参数名称从``vec``改成了``self``而已

![截屏2024-06-21 12.14.34](http://198.46.215.27:49153/i/6674fe32f00ae.png)

值得遵循惯例。除了每个人都在这样做之外，选择 self 这个名字的另一个原因是它与经常伴随类的引入而产生的观念转变：**向“面向对象”的思维**转变。从 Vector2D.magnitude(v) 到 v.magnitude() 的转变伴随着视角的转变：在表达式 Vector2D.magnitude(v) 中，感觉好像函数是这里的主动主体。我们是在说：“嘿，Vector2D.magnitude，这里有一个向量，我希望你计算其大小。”当我们改为写成 v.magnitude() 时，计算细节并没有改变，但在这种形式下，感觉像是 v 现在是主动实体。这更像是在说：“嘿，v，告诉我你的大小！”当我们采用这种第二视角时，self 这个名字开始感觉是一个不错的选择。它是关于我们正在询问这些问题的实例，并且这个实例正回答关于自己的这些问题。

-----

在我们继续之前，让我们再多谈一点关于 self。尤其是当刚开始时，常见的一个情况是通过随机地在事物前面添加"self."（或者从事物前面删除"self."）来尝试调试涉及类的问题，直到错误消息消失。正在尝试的一件事情是跳出这种"猜测和检查"的编程风格，朝着更为原则性的思考方式迈进。我们学习了环境图中的名字解析：当我要求Python查找一个名称时，它在何处以及如何查找该名称？我们在这里引入了另一套独特的名字解析规则。在这里，我们将尝试使这两种类型的名字解析规则更加清晰和具体，并希望通过这种方式开始思考何时以及如何在你自己的程序中使用 self。

我们在课程早期设立的规则是关于查找帧内变量的：该过程总结如下：

要查找一个变量：

1. 先查找当前帧
2. 如果未找到，在父帧中查找
3. 如果未找到，查找那个帧的父帧（继续跟随该过程，在父帧中查找）
4. 如果未找到，查找全局帧如果未找到，
5. 查找内置变量（诸如 print、len 等的绑定）
6. 如果未找到，引发 NameError

我们在这里引入的是一个另外的东西，我们称之为属性查找。这个概念是我们已经找到一个对象，而不是在帧内查找一个变量，我们想要在该对象内部查找一些内容。这个过程略有不同进行：

1. 首先查找对象本身
2. 如果未找到，则查找该对象的类
3. 如果未找到，则查找该类的超类
4. 如果未找到，则查找该超类的超类
5. ，如果未找到且没有更多的超类，则引发 AttributeError。

还要注意，属性查找过程永远不会跨越到开始查找帧；它是一个完全独立的过程。

一个例子

```python
class Vector2D:
  ndims = 2
  def magnitude(self):
    return (self.x ** 2 + self.y ** 2) ** 0.5
```

![截屏2024-06-21 13.01.17](http://198.46.215.27:49153/i/66750924711d2.png)

>  如果magnitude函数变成``return (x**2 + y**2)**0.5``已经return了，将会发生什么？

在这种情况下，我们需要求解x 。 在 F1 中查找 x，我们找不到它。 因此，我们在全局帧中查找 x。 也找不到那里！ 而且没有名为 x 的内置函数，因此我们最终会遇到一个 NameError。

结果表明， 为什么magnitude函数的封闭帧选择全局帧而不是 Vector2D 的类。这样设置可以确保我们既可以访问我们正在处理的实例的信息，也可以从我们帧结构中获取信息。我们可以通过 self 的方式查找属性，也可以与在任何其他函数中一样的方式在环境中查找变量。

----

**\__init__魔法函数**

```python
1. class Vector2D:
2.   ndims =3 
3.   def __init__(self, x, y):
4.     self.x = x
5.     self.y = y
6.   def magnitude(self):
7.     return (self.x ** 2 + self.y ** 2) ** 0.5
```

**环境图分析**

当我们运行完类定义时如图所示。。现在我们运行 ``v=Vector2D((6, 8))``

![截屏2024-06-21 13.14.53](http://198.46.215.27:49153/i/66750c54ac87e.png)

首先我们，创建了6，8的int对象，以及一个空的的实例，然后，由于__init__方法在”属性查找链“上，Python使用我们新创建的实例作为第一个参数隐式调用该函数，然后我们找到传给他的参数。第一个是python隐式传入的实例对象，第二第三是我们刚刚创建6，8对象，然后在新帧F1内将参数绑定到传入参数上。

![截屏2024-06-21 13.55.15](http://198.46.215.27:49153/i/667515cb88b2c.png)

再接下来，我们准备运行函数体，以下是执行完``self.x = x``的结果。跟一般的赋值语句一样，我们从F1帧找到找到名称x对应的int 对象``6``，然后我们在F1找到``self``,顺着箭头找到对应的实例队形啊个， 在里面创建了一个属性x，将它指向对象``6``。 执行``self.y = y``同理， 到这里我们执行到\__init__函数的末尾，然后我们准备清除**F1**帧

![截屏2024-06-21 13.59.15](http://198.46.215.27:49153/i/667516bba144a.png)

下面是清除完F1帧的状态

![截屏2024-06-21 14.05.17](http://198.46.215.27:49153/i/6675182a38493.png)

我们的原始目标是在全局帧执行``v = Vector2D(6 ,8)``最终结果如图

![截屏2024-06-21 14.07.11](http://198.46.215.27:49153/i/66751896d7e07.png)



__init__ 不是 Python 隐式调用的唯一方法。 Python 给我们提供了许多方法，通过其他“魔术”方法，我们可以实现与语言更紧密集成我们的自定义类型。我们可以将其中大多数视为翻译。例如：
print(x) 隐式翻译为 print(x.__str__())
abs(x) 隐式翻译为 x.__abs__()
x + y 隐式翻译为 x.__add__(y)
x - y 隐式翻译为 x.__sub__(y)
x[y] 隐式翻译为 x.__getitem__(y)
x[y] = z 隐式翻译为 x.__setitem__(y, z)

---

**案例： 链表**

![截屏2024-06-21 14.26.49](http://198.46.215.27:49153/i/66751d302a020.png)

```python
class LinkedList:
  def __init__(self, element, next_node=None):
    self.element = element
    self.next_node = next_node
  def get(self, index):
    pass
  def set(self, index, value):
    pass
  
x = LinkedList(4,
        LinkedList(8, 
            LinkedList(15, 
                LinkedList(16, LinkedList(54)))))

# 获取一个元素
## 迭代版
def get(self, index):
  for _ in range(index):
    self = self.next_node
  return self.element
## 递归版
def get(self, index):
  if index == 0:
    return self.element
  if self.next_node is None:
    raise IndexError('index out of range!')
  return self.next_node.get(index-1)

## 设置一个元素
def set(self, index, value):
  if index == 0:
    self.element = value
  if self.next_node is None:
    raise IndexError('index out of range!')
  return self.next_node.set(index-1, value)
```

这里有很多相似之处。特别是，通过链表递归方式工作以查找给定索引处的节点（包括在适当时间引发异常）的代码在两个函数中几乎完全重复！ 当然，不同的是，当我们到达正确的节点时，我们会做什么。在 get 的情况下，我们希望返回该节点的 element 属性;在 set 的情况下，我们想要修改该节点的 element 属性。 因此，我们可以编写一个帮助程序，在给定的索引处返回节点（而不是元素），然后 get 和 set 都可以根据该帮助程序实现。 在查看下面的解决方案之前，请尝试编写此代码：

```python
def _get_node(self, index):
	if index = 0:
    return self
  elif self.next_node is None:
    raise IndexError('index out of range!')
  else:
    return self.next_node._get_node(index-1)

def get(self, index):
	return self._get_node(index).element

def set(self, index, value):
  self._get_ndoe(index).element = value
```

为了做到这一点，我们需要显式调用 get 和 set 方法，如果我们可以使用我们更熟悉的语法来获取和设置元素，那就更好了。 只需要一个微小的改变就可以做到这一点。特别是，如果我们将这些方法的名称分别更改为\_\__getitem__ 和 \_\_setitem__，那么上面的示例将无需任何其他更改即可工作。 这种变化导致方法仍然可以像正常调用一样调用

```python
x.set(3, 'cat')
# 实现了"填鸭方法”(Dunder Methods) 后
x[3] = 'cat'


```

同样的，``print``也有填鸭函数如果直接print，将输出

```
<__main__.LinkedList object at SOME_MEMORY_LOCATION>
```

如果实现了\_\_str__()方法后，比如

```python
def __str__(self):
	return f"LinkedList({self.element}, {self.next_node})"
```

----

**遍历链表**

```python
for elt in x:
  print(elt)
  
## 等同于
for elt in x.__iter__():
  print(elt)

# 下面有几种实现__iter__的方式， 
## 一种是通过yield每个元素直到经过了整个链表

def __iter__(self):
  current = self
  while current is not None:
    yield current.element
    current = current.next_node

## 通过yeild from实现递归
def __iter__(self):
  yield self.element
  if self.next_node is not None:
    yield from self.next_node # 等同于 yield from self.next_node.__iter__()

```

这与常见的递归模式相似，例如处理列表时，通常会先处理列表的第一个元素，然后递归处理其余元素。对于链表，处理第一个节点（`node.data`）后，通过递归处理其余节点（`node.next`），直到到达链表的末尾（`node` 为 `None`）。

通过这种递归方法，每次递归调用处理一个节点的数据，并通过 `yield from` 语法自动将递归调用的结果逐步返回给调用者，从而实现链表的迭代。

## 总结

在本次阅读中我们涵盖了相当多的内容。我们通过从最小的例子开始构建，介绍了类和实例在环境模型中的操作规则，并逐步展示了类的许多特性，往往依赖于我们之前对名称解析和函数的经验。

我们特别仔细地观察了一些类独有的特性，特别是 Python 在某些情况下会隐式地将参数传递给方法（我们也讨论了它的惯用名称 self）。

接着我们介绍了 "dunder" 方法（也称为“魔术”方法），这些方法允许我们使用更简洁、更“Pythonic”的语法来调用某些方法（例如，允许我们使用正常的索引或加法语法来操作自定义类型的实例）。

最后，我们看了一个综合了这些内容的示例，我们开始实现一个表示链表的类；这不仅提供了思考链式数据结构的机会，还展示了一些我们可以如何利用类的方法。

在本周的实验中，你将体验一种不同类型的链式数据结构，称为前缀树，这也将为我们提供更多练习本次阅读材料的机会。在下周的阅读中，我们将扩展这些思想，介绍继承（允许在多个类之间共享结构），并且我们还会更多地讨论面向对象设计，即如何使用这些思想来帮助我们管理代码的复杂性。

# Lec 11 继承和面向对象编程

上节课我们引入了class关键字，它并不是严格需要的，但却是一种**强大的组织工具**，为我们提供了一些巧妙的方法 将我们的自定义类型集成到 Python 中，以便它们可以使用内置的 运算符和函数。

这节课我们进一步通过几个运用类功能特性，来展示类的组织工具的强大。

## 继承

我们关于属性查找的规则不仅涉及在实例及其类中查找，还可能涉及在其他类中查找（具体来说，如果我们正在处理的类有超类的话，会查找该类的超类）。但是到目前为止，我们还没有在我们的环境图中展示过任何这种关系。

回顾一下，我们上一节提到，变量查找，属性查找。

> [!IMPORTANT]
>
> 要查找一个变量：
>
> 1. 先查找当前帧
> 2. 如果未找到，在父帧中查找
> 3. 如果未找到，查找那个帧的父帧（继续跟随该过程，在父帧中查找）
> 4. 如果未找到，查找全局帧如果未找到，
> 5. 查找内置变量（诸如 print、len 等的绑定）
> 6. 如果未找到，引发 NameError
>
> 我们在这里引入的是一个另外的东西，我们称之为属性查找。这个概念是我们已经找到一个对象，而不是在帧内查找一个变量，我们想要在该对象内部查找一些内容。这个过程略有不同进行：
>
> 1. 首先查找对象本身
> 2. 如果未找到，则查找该对象的类
> 3. 如果未找到，则查找该类的超类
> 4. 如果未找到，则查找该超类的超类
> 5. 如果未找到且没有更多的超类，则引发 AttributeError。

但是到目前为止，我们还没有在我们的环境图中展示过任何这种关系，也没有讨论过这种关系对我们的代码的实际影响，更没有谈到在设计程序时如何利用这种关系。

```python
x = "dog"
class A:
  x = "cat"
class B(A):
  pass
b = B()
print(b.x)
```

这个例子，我们保持A的定义不变， 但是我们定义了B，B后面括号A，表示B时A的子类。但Python看到新定义的B类后，创建B类对象，并且引用父类。通过这种方式，在A定义而在B类没有定义的属性，也能被B类所访问，我们说B继承了A的属性和方法。

![截屏2024-06-21 16.34.06](http://198.46.215.27:49153/i/66753b0486e43.png)

当我们执行到``b=B()``时候，环境图如图

![截屏2024-06-21 17.22.27](http://198.46.215.27:49153/i/6675465bd4cfe.png)

当我们求解``b.x``时候，Python首先通过名称b找到我们的实例，然后从实例中找名``x``的属性。没有找到，就顺着箭头找到B指向的对象，我们也没找到，进而找到类A，我们找到了``"cat"``

几个例子

```python
class A:
    x = "apple"

class B(A):
    x = "banana"

    def __init__(self) -> None:
        self.x = "potato"
b = B()
print(b.x)
```

> 答案：
>
> potato

需要记住的是，当我们实例化一个类是，Python回去找名字为\_\_init__函数来初始化实力，并且遵循**“属性查找”**原则，当他找到后，会隐式调用。看下面这个例子。

```python
class A:
    x = "apple"

class B(A):
    x = "banana"

    def __init__(self):
        self.x = "potato"

class C(B):
    x = "peach"
c = C()
print(c.x)
```

> 答案
>
> potato

但我们使用

```python
class A:
    x = "apple"

class B(A):
    x = "banana"

    def __init__(self):
        self.x = "potato"

class C(B):
    x = "peach"
    def __init__(self):
      pass
c = C()
print(c.x)
```

> 答案
>
> peach



## 案例：绘图库

虽然我们学习几个例子感受继承背后的一些原理，这些知识对学好Python很重要，但是我们还没了解何时以及为什么要用这些特性在我们代码上。那下面我们就通过案例来更好地说明，我们应该如何通过这些特性来组织我们的代码，从而为管理大型程序的复杂度打下基础

### 需求

#### 基本信息

这个案例需求是实现一个绘图库，实现绘制复杂形状的功能。

在本节最后提供了一个代码框架。如果你感兴趣的话，可以在你电脑上跑。该代码顶部附近的一些辅助函数，但我们的关注点不在上面，而是关于对形状的表示和绘图实现。我们定义形状的方式是像素。

- 相对原点坐标(0, 0)在左下角,x和y都是向上增长

- 一个像素位置是(x, y)，如何判断这个形状的一部分吗？ 
  - 答： 蓝色点像素是形状的一部分，而红色点则不是

![截屏2024-06-22 11.29.14](http://198.46.215.27:49153/i/667645128ce2b.png)

我们准备用类代表形状。实现上述功能，我们需要用到特殊的魔法方法\_\_contains__，它是用来实现自定义类型``in``关键字功能的，``(x, y) in s``会被解释称``s.__contains__((x, y))``

- 任何图形的中央像素值是什么？
  - 我们用s.center来表示(x, y)
- 如何实现绘制图形
  - 给形状类 ``s`` 定义额外的方法``s.draw(im, color)``，其中im是实验2的格式，color是(r, g, b)元组

```python
class Shape:
  """
  代表2维形状
  __contain__(self, p) 返回true如果点p在形状内
    ”(x, y) in s“ 在shape的实例中会被自动转成s.__contain__((x, y))

  s.center 返回形状的中心点(x ,y)

  draw(self, image, color) 

  """

  def __contains__(self, p):
    pass
  def draw(self, image):
    pass
```

#### 形状、圆和矩形类定义

开始实现两种形状： 圆和长方形，我们可以通过继承Shape实现

```python
class Circle(Shape):
  pass
class Rectangle(Shape):
  pass
```

圆的实现

- 存储什么信息才能代表一个圆/长方形

- 我们如何用这些信息实现\_\_contains__，center和draw？

```python
class Circle(Shape):
  def __init__(self, center, radius):
    self.center = center
    self.raidus = radius
    
class Rectangle(Shape):
	def __init__(self, lower_left, width, height):
    self.low_left = lower_left
    self.width = width
    self.height = height
    
```

下一步我们思考怎么实现\_\_contains。 一个可能的起点是考虑到Circle和Rectangle都是Shape的子类，它们都会继承Shape类中的\_\_contains\_ _方法。因此，我们可以在Shape类中填充\_\_contains__方法的定义，同时保持Circle和Rectangle类不变, 类似

```python
class Shape:

  def __contains__(self, p):
    if isinstance(self, Circle):
      # 基于圆和半径计算
    if isinstance(self, Rectangle):
      # 基于圆和半径计算
  def draw(self, image):
    pass

class Circle(Shape):
  def __init__(self, center, radius):
    self.center = center
    self.raidus = radius
    
class Rectangle(Shape):
	def __init__(self, lower_left, width, height):
    self.low_left = lower_left
    self.width = width
    self.height = height
    
```

值得一提的是，这种结构是可行的，即从技术上讲，可以通过这种方式实现.但是我们会建议避免这种代码（特别是**显式类型检查**的代码），主要有几个原因。

主要原因是要考虑到未来可能会扩展我们的库，不仅仅包含圆形和矩形。目前，如果我们考虑添加一种新形状，那么我们需要在**多个地方修改代码**（需要创建一个新类并确保其设置了正确的属性，但随后我们还需要跳到Shape类中，在\_\_contains\_\_方法中添加新的条件，并确保这两个地方是一致的！）。不仅如此，如果我们不断添加形状，这个v方法会变得非常庞大和复杂，这会成为一个容易出现错误的地方。

我们希望添加新形状的过程更加简便，即所有与特定形状相关的内容都存在于一个地方（在子类中）。所以，组织上我们要实现的是：

- 只有对所有形状通用的内容才定义在Shape类中，
- 而特定形状的所有内容都定义在该形状的子类中

尽管有这个目标，但我们确实需要一种方法来区分这些行为。不过，我们将利用在这篇和上一篇阅读中学到的规则，避免编写显式类型检查代码。

```python
class Shape:

  def __contains__(self, p):
    raise NotImplementedError("Subclass of Shape didn't define __contains__")
  def draw(self, image):
    pass

class Circle(Shape):
  def __init__(self, center, radius):
    self.center = center
    self.raidus = radius
  def __contains__(self, p):
    # todo: 基于圆做计算
    assert isinstance(p, tuple) and len(p) == 2
    return sum(i-j) ** 2 for i, j in zip(self.center, p) <= self.raiius ** 2
    
class Rectangle(Shape):
	def __init__(self, lower_left, width, height):
    self.low_left = lower_left
    self.width = width
    self.height = height
  def __contains__(self, p):
    # todo: 基于矩形做计算
    px, py = p
    llx, lly = self.lower_left
    return {
      llx <= px <= llx+self.width
      and lly <= py <= lly+self.height
    }
    
```

通过这种方法，Python隐式地为我们进行类型检查，而不是显式地进行，这样可以保持我们的代码更清晰、更模块化（这将使理解、测试、调试和扩展程序变得更容易！）。

#### draw方法实现



本节我们会再介绍一种组织方式，首先，让我们尝试以与\_\_contains\_\_相同的方式组织代码，即在每个子类中实现draw方法。

```python
class Circle(Shape):
  #...
  def draw(self, image, color):
    for x in range(image['width']):
      for y in range(image['height']):
        if(x, y) in self:
          set_pixel(image, x, y, color)
          
    
class Rectangle(Shape):
  #...
  def draw(self, image, color):
    for x in range(image['width']):
      for y in range(image['height']):
        if(x, y) in self:
          set_pixel(image, x, y, color)
          
```

![截屏2024-06-22 14.12.29](http://198.46.215.27:49153/i/66766b57c6bea.png)



这些函数是完全相同的！通常情况下，像这样复制复杂的代码只会让你的代码更容易出现错误；它们给了错误很多藏身之处，并且使得当出现问题时更难找到并修复这些错误。

但更重要的是，现在实现的draw方法是完全通用的。它不仅适用于正方形或矩形，而且适用于任何能够执行包含检查（通过\_\_contains\_\_方法）的形状。

```python
class Shape:

  def __contains__(self, p):
    raise NotImplementedError("Subclass of Shape didn't define __contains__")
  def draw(self, image, color):
    for x in range(image['width']):
      for y in range(image['height']):
        if(x, y) in self:
          set_pixel(image, x, y, color)
```



完成这个步骤后，任何时候在Shape类的任何子类中寻找draw方法时，我们都找不到draw方法，但会沿着链条向上查找到Shape类，在那里我们会找到这个方法。

可能有些地方看起来有点奇怪，即我们在Shape类中定义了draw方法，但在draw方法内部却调用了一个\_\_contains\_\_方法。那么我们会不会得到之前在Shape.\_\_contains\_\_中引发的NotImplementedError呢？

事实证明这会完全正常！通常情况下，调用draw方法的方式是通过Circle或Square等形状的实例。因此，在draw方法内部，**self指的是这些子类的实例之一**。因此，当我查找self.\_\_contains\_\_时，Python会找到适合我们调用draw方法的形状类型的正确\_\_contains\_\_方法。这一点起初可能会感到有些奇怪，但这种将通用代码移到超类中的方法，然后调用子类中定义的特定方法的思想是一种非常常见和强大的组织方式，可以避免重复代码。

#### 中心点定位

还有规范中的另一部分我们还没有解决：中心点属性。

方便的是，我们的Circle类已经实现了这一点，因为我们在类定义中存储了中心点！但是我们需要确保为Rectangle类也实现这个功能。

```python
class Rectangle(Shape):
    def __init__(self, lower_left, width, height):
        self.lower_left = lower_left
        self.width = width
        self.height = height
        self.center = (lower_left[0] + width / 2, lower_left[1] + height / 2)
```

也许这是正确的做法（这完全取决于你的实现选择！）。但让我们假设一下，如果我希望允许我的形状是可变的，即我想能够更改某个Rectangle实例的lower_left。在这种情况下，我们可能会遇到一个问题，即移动lower-left角应该同时影响到center，但上面的代码并没有考虑到这一点！

在像这样存在相关值存储在实例中的情况下，避免这个问题的一种方法是将center定义为一个方法而不是属性：

```python
class Rectangle(Shape):
    def __init__(self, lower_left, width, height):
        self.lower_left = lower_left
        self.width = width
        self.height = height
    
    def center(self):
        return (self.lower_left[0] + self.width / 2, self.lower_left[1] + self.height / 2)

```

这种结构将解决上面提到的问题，因为如果我们改变了r.lower_left，那么r.center()将会相应地调整！但它也有一个缺点，那就是它不再符合我们的规范。我们的规范说r.center应该是一个元组，但是使用这种代码我们需要写r.center()而不是直接访问属性。

不过Python为我们提供了一种解决方法，即通过**@property装饰器**。如果我们在方法的定义上方写上@property：

```python
class Rectangle(Shape):
    def __init__(self, lower_left, width, height):
        self.lower_left = lower_left
        self.width = width
        self.height = height
    
    @property
    def center(self):
        return (self.lower_left[0] + self.width / 2, self.lower_left[1] + self.height / 2)
```

那么当我们使用r.center（没有圆括号）时，Python将自动调用这个方法并返回结果（因此即使我们使用动态计算的中心值，也可以满足给定的规范要求！）。

事实证明，带有@符号的这种语法比这个更通用（我们将在下一篇阅读中进一步讨论），但目前来说，将@property视为一种特殊的语法是可以的。

或许还值得一提的是，对应于设置一个值以使其具有动态效果的操作也是等效的。因此，如果我们希望能够像这样设置r.center = (2, 3)，但r.center被作为@property动态计算，我们可以编写类似以下的代码，这将调整lower_left属性，以便center具有给定的值：

```python
class Rectangle(Shape):
    def __init__(self, lower_left, width, height):
        self.lower_left = lower_left
        self.width = width
        self.height = height
    
    @property
    def center(self):
        return (self.lower_left[0] + self.width / 2, self.lower_left[1] + self.height / 2)
    
    @center.setter
    def center(self, value):
      self.lower_left = (value[0] - self.width // 2, value[0] - self.height // 2)
```



### 代码框架

```python
## FRONT MATTER FOR DRAWING/SAVING IMAGES, ETC

from PIL import Image as PILImage

# some test colors
COLORS = {
    "red": (255, 0, 0),
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "green": (0, 100, 0),
    "lime": (0, 255, 0),
    "blue": (0, 0, 255),
    "cyan": (0, 255, 255),
    "yellow": (255, 230, 0),
    "purple": (179, 0, 199),
    "pink": (255, 0, 255),
    "orange": (255, 77, 0),
    "brown": (66, 52, 0),
    "grey": (152, 152, 152),
}


def new_image(width, height, fill=(240, 240, 240)):
    return {
        "height": height,
        "width": width,
        "pixels": [fill for r in range(height) for c in range(width)],
    }


def flat_index(image, x, y):
    assert 0 <= x < image["width"] and 0 <= y < image["height"]
    return (image["height"] - 1 - y) * image["width"] + x


def get_pixel(image, x, y):
    return image["pixels"][flat_index(image, x, y)]


def set_pixel(image, x, y, c):
    assert (
        isinstance(c, tuple)
        and len(c) == 3
        and all((isinstance(i, int) and 0 <= i <= 255) for i in c)
    )
    if 0 <= x < image["width"] and 0 <= y < image["height"]:
        image["pixels"][flat_index(image, x, y)] = c


def save_color_image(image, filename, mode="PNG"):
    out = PILImage.new(mode="RGB", size=(image["width"], image["height"]))
    out.putdata(image["pixels"])
    if isinstance(filename, str):
        out.save(filename)
    else:
        out.save(filename, mode)
    out.close()


## SHAPES!


class Shape:
    # All subclasses MUST implement the following:
    #
    # __contains__(self, p) returns True if point p is inside the shape
    # represented by self
    #
    # note that "(x, y) in s" for some instance of Shape
    # will be translated automatically to "s.__contains__((x, y))"
    #
    # s.center should give the (x,y) center point of the shape
    #
    # draw(self, image, color) should mutate the given image to draw the shape
    # represented by self on the given image in the given color
    #
    def __contains__(self, p):
        pass

    def draw(self, image):
        pass


class Circle(Shape):
    pass


class Rectangle(Shape):
    pass


if __name__ == "__main__":
    out_image = new_image(500, 500)

    # add code here to draw some shapes

    save_color_image(out_image, "test.png")
```



### 总结

我们放眼整体，看继承在实际程序中作为组织工具的应用。特别是，我们探讨了如何利用继承来减少程序中冗余代码的数量，从而使程序更加清晰和可扩展。

当你考虑将这些想法应用到自己的程序中时，许多这些想法都适合进行一定程度的事先规划。我们可以提前思考要实现哪些类，它们之间的关系，它们支持的操作等等。但有些想法可能在编写代码时突然浮现。如果发生这种情况，不要害怕返回来重构你的代码；现在稍微花点时间进行重构，通常能够在后面的调试过程中节省大量时间！随着时间的推移和更多的实践，你将能够更好地提前识别哪些结构将有效，哪些不会。

这种持续的学习和实践将使你能够更加灵活和精确地设计和构建程序，从而更有效地利用面向对象编程的强大功能。

# Lec 12 函数式编程

在编程的早期，有一种叫做LISP的编程语言，是最早能在不同种类计算机上运行的编程语言之一，可以说它在1958年就把函数式编程作为一种实用的编程风格引入了。本周的实验课将引导你实现你自己的LISP子集

## 从迭代到递归

LISP 的一个有趣特性是，它没有任何循环结构（没有 `for` 或 `while` 循环）。但它有函数，正如我们之前所见，可以使用函数来实现循环。我们看的第一个例子，阶乘，总是可以这样用循环来写

```python
def factorial(n):
    result = 1
    for i in range(1, n+1):
        result *= i
    return result
```

尽管 LISP 中没有循环结构，但通过递归函数调用，可以达到与循环相同的效果.

```lisp
(defun factorial (n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))
```

或者简化成

```python
def factorial(n):
	return 1 if n <= 1 else n * factorial(n-1)
```

这个结构使用递归来实现可能看起来有点复杂，但我们将看到我们确实可以做到，使用高阶函数（即接受函数作为输入的函数）。在这里，我们将循环体（即我们希望重复多次的内容）编码为一个函数；然后，我们重复调用该函数，使用递归来跟踪我们还需要运行多少次代码。

下面是一个示例，演示如何使用递归和高阶函数来实现循环：

```python
for i in range(n):
  print('hello', i)
  
# 可以用递归写成
def repeat_n_times(n, func):
    if n == 0:
        return
    func(n)
    repeat_n_times(n-1, func)
    
```



## Class 到函数

本质上，在Pyhon里面任何类都可以用函数来实现

```python
class Bank:
  def __init__(self):
		self.accounts = {}
  def balance_of(self, account):
    return self.accounts.get(account, 0)
  def deposit(self, account, amount):
    self.accounts[account] = self.balance_of(account) + amount
# 使用
>>> b = bank()
>>> b.deposit('Steve', 3)
>>> b.deposit('Mage', 4)
>>> b.deposit('Steve', 5)
>>> b.balance_of('Steve')
8
>>> b.balance_of('Mage')
4

# 函数实现
def bank():
  accounts = {}
  def balance_of(account):
    return accounts.get(account, 0)
  def deposit(account, amount)
  	accounts[account] = balance_of(account) + amount
  return balance_of, deposit
# usage
>>> balance_of, deposit = bank()
>>> deposit('Steve', 3)
>>> deposit('Mage', 4)
>>> deposit('Steve', 5)
>>> balance_of('Steve')
8
>>> balance_of('Mage')
4

```

重要的是，`bank()` 返回的两个函数 `balance_of` 和 `deposit` 共享一个新创建的封闭帧，其中包含一个新的 `accounts` 字典。这个帧相当于面向对象版本中的对象。如果细节不清楚，尝试绘制一个环境图。



### nonlocal  用法



```python
def counter():
	tally = 0
	def increment():
    tally += 1
    return tally
  return increment
```



这段代码展示了Python中的一个常见陷阱。即变量 `tally` 被视为局部变量，而不是从封闭帧继承的变量。为什么会这样呢？

因为当一个函数修改一个变量时，Python强制要求该变量直接存在于该函数的帧中……但在这里，`tally` 并没有在本地初始化，所以Python会报错 `tally` 不存在。

但是，Python提供了一种方法来控制这种情况。特别是，如果我们想在 `increment` 中使用来自封闭帧的变量 `tally`，我们可以使用 `nonlocal` 关键字来实现这一点

```python
def counter():
	tally = 0
	def increment():
		nonlocal tally
    tally += 1
    return tally
  return increment
```

关键字的作用是：它明确指定了 `tally` 这个变量是在外部封闭函数的帧中定义的，而不是当前 `increment` 函数的局部变量。

比较一下，bank()为什么就不需要用nonlocal

**当一个函数内部要对一个变量进行修改时，默认情况下，Python 会将这个变量视为局部变量。**`bank` 不需要使用 `nonlocal accounts` 是因为 `balance_of` 和 `deposit` 函数并没有重新赋值给 `accounts` 变量，而是修改字典 `accounts` 的内容，这种操作不涉及改变变量 `accounts` 本身的引用，因此不需要 `nonlocal`。



## 备忘录

我们可以用更高阶的函数提高性能。

```python
def fib(n):
  if n < 2:
    return n
  return fib(n-2) + fib(n-1)

```



![截屏2024-06-05 09.17.56](http://198.46.215.27:49153/i/665fbccf8a663.png)

理解上来说，这是在利用**备忘录（memoization）**技术来优化递归算法。斐波那契数列的计算存在大量重复计算的情况，例如 `fib(96)` 的计算需要 `fib(95)` 和 `fib(94)`，而 `fib(95)` 的计算又需要 `fib(94)` 和 `fib(93)`，如此类推，很多中间结果会被反复计算。通过记住已经计算过的结果，我们可以大大减少计算的重复工作，从而提高效率。

```python
# 斐波那契
cache = {}
def fib(n):
	if n not in cache:
    if n < 2:
      cache[n] = n
    else:
      cache[n] = fib(n-2) + fib(n-1)
  return cache[n]
```

上面代码可以极大提升效率，但它有一个缺点：它使用了一个全局变量。在包含全局变量的大型代码库中，可能会发生各种问题。例如，在同个项目里里面，我用类似方法实现了一个数乘函数如下

```python
# 数乘
cache = {}
def factorial(n):
	if n not in cache:
    if n < 2:
      cache[n] = 1
    else:
      cache[n] = n * factorial(n-1)
  return cache[n]
```

两函数共享同一个 cache 变量，这将导致混乱！（初始赋值覆盖了现有的全局变量，而不是创建一个新的变量。）我们不希望迫使这两个函数的作者在变量名选择上进行协调。下面将``cache``放到封闭帧的做法

```python
def fib(n):
	cache = {}
  def __actual_fib(n):
    if n not in cache:
      if n < 2:
        cache[n] = n
      else:
        cache[n] = _actual_fib(n-2) + __actual_fib(n-1)
      return cache[n]
  return _actual_fib(n)
```

好的，一个主要的问题已经解决了。不过，你可能也注意到了记忆化斐波那契和阶乘函数之间存在很强的相似性。我们是否可以将这些共同部分提取出来，作为一种可重复使用的组件呢？

实现这一点的一种方法是使用一个类，代码如下：

```python
class MemorizedFunction:
  def __init__(self, func):
    self.func = func
    self.cache = {}
  def __call__(self, *args):
    if args not in self.cache:
      self.cache[args] = self.func(*args)
    return self.cache[args]
```

这里已经用到了大部分我们之前见过的方法，不过有一个新的技巧是 **call** 方法。当代码试图像调用函数一样调用某个类实例时，Python 会调用该实例的 **call** 方法。换句话说，我们可以通过定义如何调用它们来创建自己的新函数。

另一个新的技巧是应用于形式参数的 * 语法，这里称为 *args。这允许函数使用任意数量的实际参数进行调用，这些参数被捆绑在一起形成一个元组，并绑定到形式参数 args 上。（请注意，args 这个名称并没有什么特殊之处。它只是约定俗成地用于处理这种可变长度参数，就像 self 被约定俗成地用于 self 参数一样。而且在 **call** 魔术方法中使用它并没有什么特殊之处。你可以在你定义的任何函数中使用 * 来处理可变长度参数。）

最后，代码在其主体中还使用了 *args，但我们之前已经见过了——它是解包运算符，所以它将元组解包回函数 func() 的单独参数中。

```python
def fib(n):
  if n < 2:
    return n
  return fib(n-2) + fib(n-1)
fib = MemorizedFunction(fib)

# 如同前面所说，我们并不一定需要类来实现备忘录，函数也可以
def memorize(func):
  cache = {}
  def _mfunc(*args): # 会把他当作元祖
    if args not in cache:
      cache[args] = func(*args)
    return cahce[args]
  return _mfunc

# Usage
fib = memorize(fib)
```

这种使用库函数来增强函数定义的模式非常常见，以至于 Python 为此设计了特殊的语法。我们通过在另一个函数定义之前加上一个 "@" 符号和一个函数名，来表示所谓的装饰器

```python
# 或者使用装饰器形式
@memorize
def fib(n):
	if n < 2:
    return n
  return fib(n-1) + fib(n-1)
```

