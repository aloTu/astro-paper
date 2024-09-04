---
title: 【Vue3】在v-html中通过vue组件重渲染dom元素
pubDatetime: 2024-09-04T16:44:17.000+08:00
modDatetime: 2024-09-04T16:44:25.000+08:00
slug: enhencen-html-in-vue
featured: false
draft: false
tags:
  - Vue3 hooks
description: 在Vue3 中使用自定义hooks 重新挂载vue组件到 v-html 的内容中
---

```typescript
import { onBeforeUnmount, watch, nextTick, Ref, WatchSource, VNode } from "vue";
import { render } from "vue";

// 定义组件映射的类型
interface ComponentMap {
  [tag: string]: (props: Record<string, any>) => VNode;
}

// 定义 useEnhanceHtml 函数的参数类型
interface EnhanceHtmlOptions {
  components: ComponentMap;
  deps: WatchSource;
}

// 定义从属性中获取属性对象的函数类型
const getPropsFromAttributes = (attributes: Attr[]): Record<string, string> => {
  const props: Record<string, string> = {};
  attributes.forEach(attr => {
    props[attr.name] = attr.value;
  });
  return props;
};

export function useEnhanceHtml(
  elementRef: Ref<Element | null>,
  options: EnhanceHtmlOptions
) {
  const { components, deps } = options;
  const renderedInstances: Array<{ fragment: DocumentFragment; vNode: VNode }> =
    [];

  const renderComponents = () => {
    if (!elementRef.value) {
      console.error("elementRef is null");
      return;
    }
    clearComponents();
    const element = elementRef.value;
    Object.entries(components).forEach(([tag, Component]) => {
      const nodes = element.querySelectorAll(tag);
      if (!nodes) return;
      nodes.forEach(node => {
        if (typeof Component !== "function") return;
        const attributes = getPropsFromAttributes(Array.from(node.attributes));
        const vNode = Component({ ...attributes, innerHTML: node.innerHTML });
        const fragment = document.createDocumentFragment();
        render(vNode, fragment as any);
        node.replaceWith(fragment);
        renderedInstances.push({ fragment, vNode });
      });
    });
  };

  const clearComponents = () => {
    renderedInstances.forEach(({ fragment }) => {
      render(null, fragment as any);
    });
    renderedInstances.length = 0;
  };

  watch(deps, () => nextTick(renderComponents));

  onBeforeUnmount(() => clearComponents());
}
```

```ts
const mdRef = ref(null);
const html = ref(`<p>Hello, <em>world</em>!</p>`);
useEnhanceHtml(mdRef, {
  components: {
    em: () => h("i", "This is italic text"),
  },
  deps: [html],
});
```
