---

title:  Javascript中的prototype、class以及__proto__
date:  2018-12-02 19:29:33
spoiler: 谈一谈Javascript中的prototype、class以及__proto__的关系

---



在ES5的时代，如果我们要实现一个类, 例如`Dog`,通常的写法是这样子的：

``` js

function Dog(name) {
  this.name = name
}

Dog.prototype.bark = function () {
  console.log(this.name + ':汪汪汪')
}

var dog = new Dog('苟')

dog.bark()
// '汪汪汪'

```
我们之所以这样写，是因为对象的实例能通过`[[Prototype]]`原型链访问到构造函数原型上的方法，其实现通常是这样的

```js

// __proto__是一个非标准属性，不同浏览器实现不同
// __proto__ 是Dog实例化后的对象dog上的属性，dog就是通过它在原型链上查找bark方法的

dog.__proto__ === Dog.prototype

```

> `__proto__`存在于实例上，`prototype`存在于函数上

以上都是废话，相信有一定经验的前端工作者都很清楚，那么ES6中的`class`和这些有什么关系？

``` js

class Dog {
  constructor (name) {
    this.name = name
  }
  bark() {
    console.log(`${this.name}:汪汪汪`)
  }
}
const dog = new Dog('苟')

dog.bark()

```

嗯... 好像没啥特别的啊......

在控制台输入Dog，enter，看看`Dog`是个什么玩意

``` js

Dog

// 输出
class Dog {
  constructor (name) {
    this.name = name
  }
  bark() {
    console.log(`${this.name}:汪汪汪`)
  }
}


```

这什么也看不出来啊... 继续输入

```js

Dog.__proto__
// 输出
ƒ () { [native code] }

Dog.prototype
// 输出
{
  constructor: ƒ
  bark: bark()
  constructor: class Dog
  __proto__: Object
}

 ```

这里就很有趣了，注意class既有`prototype`也有 `__proto__` 这是为啥？这里就需要说一说`静态方法` 和 `静态属性`了

考虑ES5的写法

``` js

function Dog(name) {
  this.name = name
}
Dog.type = 'Dog'
Dog.show = function () {
  console.log('show')
}
Dog.prototype.bark = function () {
  console.log(this.name + ':汪汪汪')
}

Dog.type
// Dog
Dog.show()
// 'show'
Dog.bark()
// Uncaught TypeError: Dog.bark is not a function

```

所谓静态方法和属性就是我们通过类(Dog)直接访问的方法和属性，这些方法和属性是无法通过实例直接访问到的。
说了这么多你可能想问这和上面说的class的`prototype`、 `__proto__` 有啥关系？问的好

`prototype`其实和`function.prototype`的作用是一致的，即：

> 为了实例能够访问到在class中定义的方法

`__proto__` 则是为了实现类的继承，即：

> 子类能够访问父类的静态方法和属性

考虑以下代码：

``` js

  class Animal {
    static show () {
      console.log('show')
    }
    move() {
      console.log('move')
    }
  }
  class Bird extends Animal{

  }

  const b = new Bird()

  Bird.show()
  // show
  b.move()
  // move

```

`class Bird extends Animal {}`背后的真实实现,其实是这样子的

``` js

class Bird {}
class Animal {}
Object.setPrototypeOf(Bird, Animal)
Object.setPrototypeOf(Bird.prototype, Animal.prototype)

```

以上个人理解，如有谬误，烦请指正


