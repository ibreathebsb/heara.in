---

title:  用React构建一个解耦的TAB组件
date:  2018-03-23 12:29:33

spoiler: 如何用React构建一个解耦的TAB组件

---

接触React有一段时间了，发现自己以前写的代码总是出现`Component`和 `div`嵌套的情况，看起来很丑，逻辑也不能很好的解耦。本文从零开始构建一个优雅解耦的`Tab`组件，作为以后好好写组件的开始`#(滑稽)`，也希望对看到这篇文章的朋友有所帮助。

<!--more-->

# 组件拆分

要写出一个好的组件，第一步也是最关键的一步就是组件的拆分，如何讲一个组件的逻辑合理的划分到子组件中，其实是一件需要长期研究和积累的事情。之所以选择`Tab`组件，是因为简单易懂。

一个`Tab`组件的大致结构基本都是这个样子(或者说我们想要这样使用)：

``` jsx

<Tab>
  <TabChoiceContainer>
    <TabChoice>选项1</TabChoice>
    <TabChoice>选项2</TabChoice>
  </TabChoiceContainer>
  <TabContentContainer>
    <TabContent>内容1</TabContent>
    <TabContent>内容2</TabContent>
  </TabContentContainer>
</Tab>

```

`Tab`：最外层容器
`TabChoiceContainer`：Tab选项的容器
`TabChoice`： 选项
`TabContentContainer`：Tab内容的容器
`TabContent`: 内容

这个划分很简单，这里就不多说什么了。下面逐个分析各个组件怎么写

# Tab组件

需要维护什么状态呢？

1. 当前激活的是那个选项卡？

``` jsx

this.state = {
  active: 0
}

```

需要提供什么方法呢？

1. 当`TabChoice`组件被选中,需要设置当前激活的TAB

``` jsx

// tabIndex 选项卡的索引
onSelect = tabIndex => {
  this.setState({active: tabIndex})
}

```

但是想一想我们在组件拆分小节把组件拆分成这种形式了:

``` jsx

<Tab>
  <TabChoiceContainer></TabChoiceContainer>
</Tab>

```

这两个组件是互相分离的，怎么把属性传进去？

这就是解耦的关键`React.Children.map`和`React.cloneElement`

1. 通过`React.Children.map`遍历子组件 [文档](https://reactjs.org/docs/react-api.html#reactchildrenmap)
2. 通过`React.cloneElement(child, props)`为组件添加额外属性 [文档](https://reactjs.org/docs/react-api.html#cloneelement)

👌就这些吧，越简单越好，这样我们就得到了`Tab`组件：

``` jsx

import React from 'react'
import TabChoiceContainer from './TabChoiceContainer'
import TabContentContainer from './TabContentContainer'

class Tab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: 0
    }
  }
  render () {
    const { children, className = '', activeChoiceClass } = this.props
    const { active } = this.state
    const childrenWithProps = React.Children.map(children, (child, tabIndex) => {
      /* 这里做了类型判断 可以考虑使用propTypes */
      return child.type === TabContentContainer
      ? React.cloneElement(child, { active, activeChoiceClass})
      : React.cloneElement(child, { active, onSelect: this.onSelect})
    })
    return (
      <div className={className}>
        {childrenWithProps}
      </div>
    )
  }
  onSelect = tabIndex => {
    this.setState({active: tabIndex})
  }
}

```

# TabChoiceContainer组件

需要将`Tab`提供的方法和属性继续传递下去，同时给`TabChoice`组件提供`activeClass`
当`TabChoice`组件被选中时添加该类，展示选中激活态。属性的传递和`Tab`是一个套路

直接上代码了

``` jsx

const TabChoiceContainer = (props) => {
    const { children, onSelect, className = '', active, activeClass } = props
    const childrenWithProps = React.Children.map(children, (child, tabIndex) => {
      return React.cloneElement(child, { tabIndex,
        onSelect,
        activeClass,
        active: active === tabIndex}
      )
    })
    return (
      <div className={className}>
        {childrenWithProps}
      </div>
    )
}

```

# TabChoice组件

这个组件负责展示一个选项，并处理点击选中事件，往往选中后会还需要加一个`activeClass`的类名来区分选中和未选中的状态。有时`Tab`组件还需要禁用，无法切换到改选项卡。
其中`disabled`属性如果被设置为`true`，标识选项卡被禁用，用户点击时，
执行`disableCallback`函数给用户提示，例如`活动尚未开始`

``` jsx

const empty = () => {}
const TabChoice = (props) => {
  const { onSelect,
    tabIndex,
    activeClass,
    className = '',
    disabled,
    active,
    disableCallback = empty } = props
  return (
    <div className={`${className} ${active ? activeClass : ''}`} onClick={
      () => { disabled ? disableCallback() : onSelect(tabIndex)}
    }>
      {props.children}
    </div>
  )
}

```

# TabContentContainer组件

从Tab组件获取当前激活的选项卡索引，并根据`active === tabIndex`来确定`TabContent`是否显示,
当然也可以像`TabChoiceContainer`一样提供一个`activeClass`。

``` jsx

const TabContentContainer = (props) => {
    const { children, active, className = '' } = props
    const childrenWithProps = React.Children.map(children, (child, tabIndex) => {
      return React.cloneElement(child, { active: active === tabIndex})
    })
    return (
      <div className={className}>
        {childrenWithProps}
      </div>
    )
}

```

# TabContent组件

简单处理如果组件的`active`为`falsey`,添加 `display: 'none'`

``` jsx

const displayNone = { display: 'none' }

const TabContent = (props) => {
    const { active, className = '' } = props
    return (
      <div style={ active ? null : displayNone }
        className={className}>
        {props.children}
      </div>
    )
}

```

# 导出

最后提供一个`index.js`导出所有组件就可以在其他组件中使用了

``` js

export { default as Tab }  from './Tab'
export { default as TabChoice } from './TabChoice'
export { default as TabChoiceContainer } from './TabChoiceContainer'
export { default as TabContent } from './TabContent'
export { default as TabContentContainer } from './TabContentContainer'

```
