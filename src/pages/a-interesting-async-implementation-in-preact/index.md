---

title:  preact中一段巧妙的异步执行代码
date:  2018-05-23 19:41:06
spoiler: 今天从github上克隆下preact的代码，打开翻了一下，然后看到utils里面有一个奇妙的`defer`函数，第一眼看到它我一脸懵逼

---


<!-- more -->

废话不多说直接上代码

```js

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
export const defer = typeof Promise=='function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;


```

如同注释所说，是一个异步的尽可能快的执行的函数

## 第一眼看到 `@param {Function} callback`

**内心：**

what？ 你这个`defer`在哪里接受的`callback`?

## 第二眼看到 `Promise.resolve().then.bind(Promise.resolve())`

**内心：**

what? what the fuck!? 你这是要干嘛？

然后冷静下来分析下。。。

## 第一个问题

仔细看，右侧表达式，不管是 `bind` 还是 `setTimeout` 其结果都是函数，因此`defer`是一个函数,可以采用`defer(callback)` 的形式执行

## 第二个问题

我们把

`Promise.resolve().then.bind(Promise.resolve())`

分解下

```js

const defer = (function () {
  const then = Promise.resolve().then
  const p = Promise.resolve()
  return then.bind(p)
})()

```

`then`方法调用时`this`不是`Promise`的实例会报错

```js

Uncaught TypeError: Method Promise.prototype.then called on incompatible receiver undefined
    at then (<anonymous>)
    at <anonymous>:1:1

```

## 上述写法的优点？

简洁？

maybe...

这个方法后续调用的时候只会用到两个`Promise`实例,可以任务节省内存

```js

const defer = Promise.resolve().then.bind(Promise.resolve())

```

## 如果要我实现我怎么写


#### 使用`setTimeout`

```js

const defer = window.setTimeout

```
#### 使用`Promise`
```js

const defer = (function(){
  const p = Promise.resolve()
  const d = (callback) => {
    p.then(callback)
  }
  return d
})()

```




