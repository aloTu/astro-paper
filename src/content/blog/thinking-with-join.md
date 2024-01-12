---
title: Thinking with join(译)--D3
pubDatetime: 2024-08-03T15:00:00Z
description: add a markdown plugin to custom render my code like codehike
---

[原文链接](https://bost.ocks.org/mike/join/)

> 假设你正在使用 D3 创建一个基础的散点图，需要创建一些 SVG 圆形 元素来图形化你的数据。你会发现 D3 没有对创建多个 DOM 元素的原生支持。哈？

当然，你可以使用 append 方法创建一个元素

```js
svg.append("circle").attr("cx", d.x).attr("cx", d.y).attr("r", 2.5);
```

但这只是一个圆， 而你需要的是每一条数据生成一个圆。
在你拿出`for`循环并且打算遍历之前，思考这个 D3 中的示例。

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
