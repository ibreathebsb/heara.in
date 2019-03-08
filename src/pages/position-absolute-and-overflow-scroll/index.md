---

title:  css中position:absolute和overflow:scroll的坑
date:  2018-06-15 18:18:46
spoiler: 记录一下工作中遇到的一个css小问题

--- 

最近项目遇到了滚动和fixed问题，考虑到iOS下`position: fixed`的诸多问题，考虑使用`position: absolute`代替，然而万万没想到，居然这个绝对定位的元素居然也跟着滚动起来...

<!-- more -->

## 布局

``` html

  <div class="container">
    <div class="content"></div>
    <div class="fake-fixed"></div>
  </div>


```

```css

  .container {
    height: 100px;
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .content {
    height: 500px;
  }
  .fake-fixed {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

```

## 期望效果

`.content`在`.container`内局部滚动，`.fake-fixed`一直保持在`.container`底部，表现类似`fixed`

## 实际效果

`.fake-fixed`随着`.content`滚动而滚动

## 修复

在添加一层容器

```html
   <div class="container">
    <div class="content-wrapper">
      <div class="content"></div>
    </div>
    <div class="fake-fixed"></div>
  </div>

```

```css

  .container {
    height: 100px;
    position: relative;
    overflow: hidden;

  }
  .content-wrapper {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .content {
    height: 500px;
  }
  .fake-fixed {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

```
