---

title: 理解webpack4中splitChunks的3种模式
date: 2018-09-17 21:54:53
spoiler: 今天聊一聊webpack4中的splitChunks的3中模式 `initial` `async` `all`
---



<!-- more -->

## initial

```js

// webpack.config.js
optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'initial',
      minSize: 0,
      automaticNameDelimiter: '.',
      name: true,
    }
}

```

`initial` 初始chunk指的是会在我们页面中会议script标签进行引用的chunk,在这里理解为`entry point`更加合理。当chunks的值被设置为`initial`时，`webpack`会从几个`entry point`寻找共同的chunk并将它们抽离出来。

一个示例：

三个子模块`a.js`,`b.js`,`c.js`

```js

// a.js
export const a = () => console.log('a')

```

```js

// b.js
export const b = () => console.log('b')

```

```js

// c.js
export const c = () => console.log('c')

```


三个入口文件 `x.js`,`y.js`,`z.js`

```js

// x.js

import { a } from './a'
import { b } from './b'
import { c } from './c'

a()
b()
c()

```

```js

// y.js
import { b } from './b'
b()

```

```js

//z.js
import { c } from './c'
c()

```

打包结果

```shell

Version: webpack 4.19.0
Time: 769ms
Built at: 2018-09-17 21:45:29
                      Asset       Size   Chunks             Chunk Names
                 runtime.js   6.04 KiB  runtime  [emitted]  runtime
  x.52298057ad794c677ad0.js   1.29 KiB        x  [emitted]  x
x.y.4a4994beef749c762b94.js  399 bytes      x.y  [emitted]  x.y
x.z.0217d5fc8ef98d66c601.js  394 bytes      x.z  [emitted]  x.z
  y.b7f3cafb712c77184370.js  716 bytes        y  [emitted]  y
  z.9dfc882705cf30b10fc2.js  716 bytes        z  [emitted]  z
                 index.html  684 bytes           [emitted]
Entrypoint x = runtime.js x.y.4a4994beef749c762b94.js x.z.0217d5fc8ef98d66c601.js x.52298057ad794c677ad0.js
Entrypoint y = runtime.js x.y.4a4994beef749c762b94.js y.b7f3cafb712c77184370.js
Entrypoint z = runtime.js x.z.0217d5fc8ef98d66c601.js z.9dfc882705cf30b10fc2.js
[./src/a.js] 59 bytes {x} [built]
[./src/b.js] 64 bytes {x.y} [built]
[./src/c.js] 59 bytes {x.z} [built]
[./src/x.js] 396 bytes {x} [built]
[./src/y.js] 336 bytes {y} [built]
[./src/z.js] 336 bytes {z} [built]

```

结果分析:

共生成了6个文件：

  - `runtime`:  webpack的模块加载系统
  - `x`, `y`, `z` : 分别对应着三个入口文件
  - `x.y`，`x.z`： 分别是`x`和`y`的公共chunk，`x`和`z`的公共chunk

由于`x`和`y`共享模块`b`，`b`就被提取出来单独打包了`x.y`里面,查看下`x.y`里面的内容:

```js

// x.y.4a4994beef749c762b94.js

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["x.y"],{

/***/ "./src/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return b; });
var b = function b(text) {// <= 我们的b模块就是这里啦
  return console.warn('b');
};

/***/ })

}]);


```


## async

`async`就比较好理解了，值对使用动态导入语法`import()`的chunk进行分割

直接上例子：



```js

// webpack.config.js
optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      automaticNameDelimiter: '.',
      name: true,
    }
}

```

```js

// x.js
import { b } from './b'
import { c } from './c'

import(/* webpackChunkName: 'a' */ './a').then(({a}) => a())
b()
c()

```

打包结果

```shell

Hash: 6e7ab31c75d5547d92b2
Version: webpack 4.19.0
Time: 622ms
Built at: 2018-09-17 23:07:49
                    Asset       Size   Chunks             Chunk Names
a.fff072717b457054e2ec.js  392 bytes        a  [emitted]  a
               runtime.js   8.81 KiB  runtime  [emitted]  runtime
x.4347b3a6f9f051c2b383.js   1.34 KiB        x  [emitted]  x
y.d2cbbe1d653124bf3547.js  726 bytes        y  [emitted]  y
z.e8b91a3f2a23c5bce4fc.js  721 bytes        z  [emitted]  z
               index.html  536 bytes           [emitted]
Entrypoint x = runtime.js x.4347b3a6f9f051c2b383.js
Entrypoint y = runtime.js y.d2cbbe1d653124bf3547.js
Entrypoint z = runtime.js z.e8b91a3f2a23c5bce4fc.js
[./src/a.js] 59 bytes {a} [built]
[./src/b.js] 64 bytes {x} {y} [built]
[./src/c.js] 59 bytes {x} {z} [built]
[./src/x.js] 188 bytes {x} [built]
[./src/y.js] 29 bytes {y} [built]
[./src/z.js] 29 bytes {z} [built]

```

可以看出尽管`x`和`y`, `x`和`z`都有公共部分,但只有异步导入的`a`模块被单独构建出来,`b`和`c`的代码存在重复：

```js

// a.fff072717b457054e2ec.js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["a"],{

/***/ "./src/a.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
var a = function a() {
  return console.log('a');
};

/***/ })

}]);

```

```js

// x.4347b3a6f9f051c2b383.js

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["x"],{

/***/ "./src/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return b; });
var b = function b(text) {
  return console.warn('b');
};

/***/ }),

/***/ "./src/c.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return c; });
var c = function c() {
  return console.log('c');
};

/***/ }),

/***/ "./src/x.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/b.js");
/* harmony import */ var _c__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/c.js");
// import { a } from './a'


__webpack_require__.e(/* import() | a */ "a").then(__webpack_require__.bind(null, "./src/a.js")).then(function (_ref) {
  var a = _ref.a;
  return a();
});
Object(_b__WEBPACK_IMPORTED_MODULE_0__["b"])();
Object(_c__WEBPACK_IMPORTED_MODULE_1__["c"])();

/***/ })

},[["./src/x.js","runtime"]]]);


```

```js
// y.d2cbbe1d653124bf3547.js

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["y"],{

/***/ "./src/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return b; });
var b = function b(text) {
  return console.warn('b');
};

/***/ }),

/***/ "./src/y.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/b.js");

Object(_b__WEBPACK_IMPORTED_MODULE_0__["b"])();

/***/ })

},[["./src/y.js","runtime"]]]);

```

可以看出`x`和`y`的bundle里面`b`的代码重复了，不过这就是`async`模式的特点：只处理`import()`

## all

`all` 不管什么chunk类型，符合配置条件的全部抽出来

```shell

Version: webpack 4.19.0
Time: 606ms
Built at: 2018-09-17 23:17:16
                      Asset       Size   Chunks             Chunk Names
  a.fff072717b457054e2ec.js  392 bytes        a  [emitted]  a
                 runtime.js   8.81 KiB  runtime  [emitted]  runtime
  x.eb5392750ad2fc843d72.js  741 bytes        x  [emitted]  x
x.y.4a4994beef749c762b94.js  399 bytes      x.y  [emitted]  x.y
x.z.0217d5fc8ef98d66c601.js  394 bytes      x.z  [emitted]  x.z
  y.a10abf98f5dd5604c717.js  409 bytes        y  [emitted]  y
  z.3c6fb959ec0f195c66d2.js  409 bytes        z  [emitted]  z
                 index.html  684 bytes           [emitted]
Entrypoint x = runtime.js x.y.4a4994beef749c762b94.js x.z.0217d5fc8ef98d66c601.js x.eb5392750ad2fc843d72.js
Entrypoint y = runtime.js x.y.4a4994beef749c762b94.js y.a10abf98f5dd5604c717.js
Entrypoint z = runtime.js x.z.0217d5fc8ef98d66c601.js z.3c6fb959ec0f195c66d2.js
[./src/a.js] 59 bytes {a} [built]
[./src/b.js] 64 bytes {x.y} [built]
[./src/c.js] 59 bytes {x.z} [built]
[./src/x.js] 188 bytes {x} [built]
[./src/y.js] 29 bytes {y} [built]
[./src/z.js] 29 bytes {z} [built]

```

可以看出`a` `x.y` `x.z`均被单独打包出来、

## 最后

以上就是三种模式的区别，比较常用的还是`all`，后面打算写一下`runtime`的工作原理,敬请期待！
