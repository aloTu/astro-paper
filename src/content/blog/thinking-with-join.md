---
title: Thinking with join(译)
pubDatetime: 2024-08-14T11:05:22+08
description: D3.js join 方法 解析
tags:
  - D3.js
---

[原文链接](https://bost.ocks.org/mike/join/)

> 假设你正在使用 D3 创建一个基础的散点图，需要创建一些 SVG 圆形 元素来图形化你的数据。你会发现 D3 没有对创建多个 DOM 元素的原生支持。哈？

当然，你可以使用 append 方法创建一个元素

```js
svg.append("circle").attr("cx", d.x).attr("cx", d.y).attr("r", 2.5);
```

<side-note>
  这里的 "svg" 指的是一个包含之前创建的（或者从当前页面中选择的）单个 &ltsvg&gt 元素的选择。
</side-note>

但这只是一个圆， 而你需要的是每一条数据生成一个圆。
在你拿出`for`循环并且打算遍历之前，思考这个 D3 中的示例。

<div class="flex">

<div class="flex-1">

```js
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", 2.5);
```

</div>

<div class="max-w-48 bg-slate-800 text-[10px] my-[24px] px-4 py-2 rounded-md text-[#e1e4e8]">
  Here data is an array of JSON objects with x and y properties, such as: [{"x": 1.0, "y": 1.1}, {"x": 2.0, "y": 2.5}, …].
</div>
</div>

这部分代码正好可以实现你的需求：它为每一条数据(包含x，y位置信息)创建了一个圆形元素。但`selectAll("circle")`是什么？为什么你需要选择一个你明明知道不存在的元素来创建一个新的元素？

事情是这样的，**_不要告诉 D3 怎么去做， 告诉 D3 你想要什么_**。你的需求是圆形元素和数据对应（每条数据一个圆形 )。不要指示 D3 创建圆形， 而是告诉D3“圆形”选区应该与数据相对应。这个概念被成为**数据连接**:

<p class="text-center mx-auto">
  <svg viewBox="0 0 720 240" preserveAspectRatio="xMidYMid meet" style="max-width: 720px; width: 100%; height: auto;">
    <g transform="translate(0,128)">
      <g transform="translate(300)">
        <circle r="110" style="fill: rgb(49, 130, 189); fill-opacity:.2;"></circle>
        <text y="-120" dy=".35em" text-anchor="middle" style="font-weight: bold;">Data</text>
        <text x="-50" dy=".35em" text-anchor="middle">Enter</text>
      </g>
      <text x="360" dy=".35em" text-anchor="middle">Update</text>
      <g transform="translate(420)">
        <circle r="110" style="fill: rgb(230, 85, 13); fill-opacity: .2;"></circle>
        <text y="-120" dy=".35em" text-anchor="middle" style="font-weight: bold;">Elements</text>
        <text x="50" dy=".35em" text-anchor="middle">Exit</text>
      </g>
    </g>
  </svg>
</p>

数据结点加入当前元素创建了 **_update_** (内部)选区。剩下未绑定的数据创建了 **_enter_** 选区（左侧）， 代表缺失的元素。 同样的，任何未绑定的元素创建了 **_exit_** 选区（右侧）， 代表需要移除的元素。

现在我们可以通过**data join**来解开 enter-append 序列的神秘面纱:

1. 首先, 因为 SVG 容器是空的， `svg.selectAll("circle")` 返回一个新创建的空选区。空选区的父节点是 SVG 容器。
2. 这个选取随后被添加到数组中， 产生了三个新的选区代表三种状态: **_enter_**, **_update_**, 和 **_exit_**。 由于这个选区是空的，**_update_** 选区和 **_exit_** 选区都是空的，而 **_enter_** 选区包含了新数据的占位符。
3. **_update_** 选区作为[selection.data](https://d3js.org/d3-selection/joining#selection_data)的返回值，而 **_enter_** 和 **_exit_** 依赖与**_update_** 的结果。 [selection.enter](https://d3js.org/d3-selection/joining#selection_enter) 返回**_enter_** 选区。
4. 调用 **enter** 选区上的 [selection.append](https://d3js.org/d3-selection/modifying#selection_append) 方法，添加 SVG 容器缺失的元素。`append` 方法为每一个数据点追加一个新的圆到 SVG 容器中。

使用连接（joins）进行思考意味着声明一个选择（例如“圆形”）和数据之间的关系，然后通过进入、更新和退出这三个状态来实现这种关系。

但是何必麻烦呢？ 为什么不直接通过一个原语创建多个元素？ data join 的妙在于它的泛化能力。当然上面的代码只处理了 **enter** 选区，可以满足静态可视化的需求。 你可以使用 **update** 和 **exit** 仅用很少修改拓展项目支持 [动态可视化](https://bost.ocks.org/mike/miserables/)。 同时这一位置你可以可视化 [实时数据](https://bost.ocks.org/mike/path/)， 支持[交互探索](https://gist.github.com/mbostock/4063663)、数据集间添加[平滑过渡](https://gist.github.com/mbostock/1256572)。

下面是一个处理三种状态的是例子:

```js
var circle = svg.selectAll("circle").data(data);

circle.exit().remove();

circle
  .enter()
  .append("circle")
  .attr("r", 2.5)
  .merge(circle)
  .attr("cx", function (d) {
    return d.x;
  })
  .attr("cy", function (d) {
    return d.y;
  });
```

每当这段代码运行时，它会重新计算数据连接，并保持元素和数据之间的期望对应关系。如果新数据集比旧数据集小，多余的元素最终会进入退出选择并被移除。如果新数据集更大，多余的数据最终会进入进入选择，并且会添加新的节点。如果新数据集的大小完全相同，那么所有元素都只需用新位置更新，不需要添加或移除任何元素。

使用连接进行思考意味着你的代码更加声明式：你处理这三个状态（**enter**、**update**、**exit**）而不需要任何分支（if）或迭代（for）。相反，你描述元素应该如何与数据相对应。如果给定的进入、更新或退出选择恰好为空，相应的代码就不会执行任何操作（no-op）。
连接还允许你根据需要将操作定位到特定的状态。例如，你可以在进入状态而不是更新状态时设置常量属性（比如由"r"属性定义的圆形半径）。通过重新选择元素并最小化DOM变化，你可以大幅提高渲染性能！同样，你可以将动画过渡定位到特定的状态。例如，对于进入的圆形进行扩展进入的动画效果：

```js
circle.enter().append("circle").attr("r", 0).transition().attr("r", 2.5);
```

类似的， 对于退出元素状态

```js
circle.exit().transition().attr("r", 0).remove();
```

现在你学会使用 data join 思考了！
想要评论或者提问？~~[discuss on HN](http://news.ycombinator.com/item?id=3581614)~~

## 附件

我已经编写了一系列关于[通用更新模式](https://gist.github.com/mbostock/3808218)的例子，作为对这篇文章的后续补充。
