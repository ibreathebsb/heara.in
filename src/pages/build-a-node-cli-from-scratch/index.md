---

title:  从零开始创建一个node-cli
date:  2018-08-28 16:13:43

---

懒是程序员的美德。本文以一个创建react组件的的node-cli小工具为例，介绍了从项目初始化到发布到npm的完整流程。

<!-- more -->

废话少说，开始干活！

## 需求

写过react项目的同学大概都有这样的经历：每次新创建一个组件都需要创建一个文件夹，然后创建三个文件,目录结构如下(假设使用sass和ts):

```bash

  \MyComponent
    - MyComponent.tsx
    - index.ts
    - MyComponent.scss

```

每次都这么写，是不是有点累了？起始我累了很久了！！终于下定决心不想继续累下去了，于是写了这个小工具，专门生成组件的的模版文件，同时考虑语言和react组件类型
梳理了一下，我们这个小工具需要支持：

1. 两种语言`js`和`ts`
2. 三种组件`React.Component`, `React.PureComponent`, `React.SFC`(即`Stateless functional component`)

ok，需求已经搞清楚了，开始干活！

## 初始化

### 创建目录

  `mkdir create-react-componnet && cd create-react-componnet`

### 初始化包信息

   `npm init`

### 创建目录结构

```bash

\create-react-component
  README.MD
  command.js // 处理命令行参数
  create-react-component.js //主要逻辑处理
  index.js //入口
  node_modules
  package.json
  template //存放模版文件
  utils //工具

```

### 安装依赖

  这里使用`yarn`，当然也可以使用`npm`, `yarn add chalk commander`

### 让代码跑起来

  先整个hello world吧!

  `create-react-component.js`

  ```js

  module.exports = () => { console.log('Hello World')}

  ```

  `index.js`

  ```js

  require('./create-react-component')()

  ```

打开终端,输入 `node index.js`

```bash

Hello World!

```

这样我们的程序能够跑起来了！但是有个问题就是我们还不能像使用linux下的`mkdir`等命令一样执行我们的程序，咋整？

首先给我们的`index.js`添加执行权限`chmod a+x index.js`

然后将文件的执行设置为使用node执行，这样一来我们能够使用`./index.js`来执行我们的文件了

```bash

#! /usr/bin/env node

require('./create-react-component')()

```

然后为了其他用户能够在命令行中使用我们的小工具，需要更新下`package.json`:

```json

{
   "bin": {
    "create-react-component": "./index.js"
  },
}

```

当用户全局安装我们的npm包时，便可以使用`create-react-component`来执行我们的程序了，以下是我发布包后全局安装看到的结果

可以看出`node`下的`bin`目录下的`create-react-component`是一个软链接文件，指向了我们的`index.js`

```bash

echo $PATH

/Users/isaac/.nvm/versions/node/v8.11.1/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Wireshark.app/Contents/MacOS

which create-react-component

/Users/isaac/.nvm/versions/node/v8.11.1/bin/create-react-component

ls -l /Users/isaac/.nvm/versions/node/v8.11.1/bin/create-react-component

lrwxr-xr-x  1 isaac  staff  61  8 25 14:48 /Users/isaac/.nvm/versions/node/v8.11.1/bin/create-react-component -> ../lib/node_modules/@isaac.js/create-react-component/index.js

```

## 编写主要逻辑

 思想很简单，无非是读取文件，然后根据用户输入的文件名，把我们的模版文件中的组件名称，文件名等等替换
 例如这是一个组件的模版:

 ```tsx

import * as React from 'react'
import cStyle from './__REPLACE__.scss'

type __REPLACE__Props = {}
type __REPLACE__State = {}

export class __REPLACE__ extends React.PureComponent<__REPLACE__Props, __REPLACE__State> {
  public render() {
    return (
      <div className={cStyle.__REPLACE__}>__REPLACE__</div>
    )
  }
}

```

我们需要做的就是:

```js

// 读取文件内容
const content = fs.readFileSync(src, {
  encoding: 'UTF-8'
})
//将__REPLACE__替换为我们的组件名
fs.writeFileSync(dest, content.replace(REPLACE, componentName), {
  encoding: 'UTF-8'
})

```


[查看完整源码](https://github.com/ibreathebsb/create-react-component)

## 发布

### 没有npm账号自[注册](https://www.npmjs.com/)

### 登录npm账号

```bash

  npm login

```

### 发布到npm

npm包有两种，私有和公有，公有的包没有`@org`前缀，所以要抢注册名字，太麻烦，这里我们选择带有私有前缀的发布方式：

1. 在npm网站上创建组织,这里是`isaac.js`
2. 在组织下创建包，这里是`create-react-component`
3. 在项目根目录下 `npm publish --access public`， 发布成功

### 全局安装

等我们的包发布成功以后，便可以自己先安装一下

`npm i -g @isaac.js/create-react-component`

## 最后

贴一下包地址，欢迎体验！

[npm](https://www.npmjs.com/package/@isaac.js/create-react-component)
[github](https://github.com/ibreathebsb/create-react-component)
