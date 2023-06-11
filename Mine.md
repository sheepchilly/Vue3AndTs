# 运营平台

本项目涉及到技术栈包含**_:vue3+TypeScript+vue-router+pinia+element-plus+axios+echarts_**等技术栈。

## 一、vue3 组件通信方式

**通信仓库地址:https://gitee.com/jch1011/vue3_communication.git**

不管是 vue2 还是 vue3,组件通信方式很重要,不管是项目还是面试都是经常用到的知识点。

**比如:vue2 组件通信方式**

**props:**可以实现父子组件、子父组件、甚至兄弟组件通信

**自定义事件**:可以实现子父组件通信

**全局事件总线$bus**:可以实现任意组件通信

**pubsub:**发布订阅模式实现任意组件通信

**vuex**:集中式状态管理容器，实现任意组件通信

**ref**:父组件获取子组件实例 VC,获取子组件的响应式数据以及方法

**slot:**插槽(默认插槽、具名插槽、作用域插槽)实现父子组件通信........

### 1.1props

props 可以实现父子组件通信,在 vue3 中我们可以通过 defineProps 获取父组件传递的数据。且在组件内部不需要引入 defineProps 方法可以直接使用！

**父组件给子组件传递数据**

```
<Child info="我爱祖国" :money="money"></Child>
```

**子组件获取父组件传递数据:方式 1**

```
let props = defineProps({
  info:{
   type:String,//接受的数据类型
   default:'默认参数',//接受默认数据
  },
  money:{
   type:Number,
   default:0
}})
```

**子组件获取父组件传递数据:方式 2**

```
let props = defineProps(["info",'money']);
```

子组件获取到 props 数据就可以在模板中使用了,但是切记 props 是只读的(只能读取，不能修改)

### 1.2 自定义事件

在 vue 框架中事件分为两种:一种是原生的 DOM 事件，另外一种自定义事件。

原生 DOM 事件可以让用户与网页进行交互，比如 click、dbclick、change、mouseenter、mouseleave....

自定义事件可以实现子组件给父组件传递数据

#### 1.2.1 原生 DOM 事件

代码如下:

```
 <pre @click="handler">
      我是祖国的老花骨朵
 </pre>
```

当前代码级给 pre 标签绑定原生 DOM 事件点击事件,默认会给事件回调注入 event 事件对象。当然点击事件想注入多个参数可以按照下图操作。但是切记注入的事件对象务必叫做$event.

```
  <div @click="handler1(1,2,3,$event)">我要传递多个参数</div>
```

在 vue3 框架 click、dbclick、change(这类原生 DOM 事件),不管是在标签、自定义标签上(组件标签)都是原生 DOM 事件。

**<!--vue2中却不是这样的,在vue2中组件标签需要通过native修饰符才能变为原生DOM事件-->**

#### 1.2.2 自定义事件

自定义事件可以实现子组件给父组件传递数据.在项目中是比较常用的。

比如在父组件内部给子组件(Event2)绑定一个自定义事件

```
<Event2  @xxx="handler3"></Event2>
```

在 Event2 子组件内部触发这个自定义事件

```
<template>
  <div>
    <h1>我是子组件2</h1>
    <button @click="handler">点击我触发xxx自定义事件</button>
  </div>
</template>

<script setup lang="ts">
let $emit = defineEmits(["xxx"]);
const handler = () => {
  $emit("xxx", "法拉利", "茅台");
};
</script>
<style scoped>
</style>
```

我们会发现在 script 标签内部,使用了 defineEmits 方法，此方法是 vue3 提供的方法,不需要引入直接使用。defineEmits 方法执行，传递一个数组，数组元素即为将来组件需要触发的自定义事件类型，此方执行会返回一个$emit 方法用于触发自定义事件。

当点击按钮的时候，事件回调内部调用$emit 方法去触发自定义事件,第一个参数为触发事件类型，第二个、三个、N 个参数即为传递给父组件的数据。

需要注意的是:代码如下

```
<Event2  @xxx="handler3" @click="handler"></Event2>
```

正常说组件标签书写@click 应该为原生 DOM 事件,但是如果子组件内部通过 defineEmits 定义就变为自定义事件了

```
let $emit = defineEmits(["xxx",'click']);
```

### 1.3 全局事件总线

全局事件总线可以实现任意组件通信，在 vue2 中可以根据 VM 与 VC 关系推出全局事件总线。

但是在 vue3 中没有 Vue 构造函数，也就没有 Vue.prototype.以及组合式 API 写法没有 this，

那么在 Vue3 想实现全局事件的总线功能就有点不现实啦，如果想在 Vue3 中使用全局事件总线功能

可以使用插件 mitt 实现。

**mitt:官网地址:https://www.npmjs.com/package/mitt**

### 1.4v-model

v-model 指令可是收集表单数据(数据双向绑定)，除此之外它也可以实现父子组件数据同步。

而 v-model 实指利用 props[modelValue]与自定义事件[update:modelValue]实现的。

下方代码:相当于给组件 Child 传递一个 props(modelValue)与绑定一个自定义事件 update:modelValue

实现父子组件数据同步

```
<Child v-model="msg"></Child>
```

在 vue3 中一个组件可以通过使用多个 v-model,让父子组件多个数据同步,下方代码相当于给组件 Child 传递两个 props 分别是 pageNo 与 pageSize，以及绑定两个自定义事件 update:pageNo 与 update:pageSize 实现父子数据同步

```
<Child v-model:pageNo="msg" v-model:pageSize="msg1"></Child>
```

### 1.5useAttrs

在 Vue3 中可以利用 useAttrs 方法获取组件的属性与事件(包含:原生 DOM 事件或者自定义事件),次函数功能类似于 Vue2 框架中$attrs属性与$listeners 方法。

比如:在父组件内部使用一个子组件 my-button

```
<my-button type="success" size="small" title='标题' @click="handler"></my-button>
```

子组件内部可以通过 useAttrs 方法获取组件属性与事件.因此你也发现了，它类似于 props,可以接受父组件传递过来的属性与属性值。需要注意如果 defineProps 接受了某一个属性，useAttrs 方法返回的对象身上就没有相应属性与属性值。

```
<script setup lang="ts">
import {useAttrs} from 'vue';
let $attrs = useAttrs();
</script>
```

### 1.6ref 与$parent

ref,提及到 ref 可能会想到它可以获取元素的 DOM 或者获取子组件实例的 VC。既然可以在父组件内部通过 ref 获取子组件实例 VC，那么子组件内部的方法与响应式数据父组件可以使用的。

比如:在父组件挂载完毕获取组件实例

父组件内部代码:

```
<template>
  <div>
    <h1>ref与$parent</h1>
    <Son ref="son"></Son>
  </div>
</template>
<script setup lang="ts">
import Son from "./Son.vue";
import { onMounted, ref } from "vue";
const son = ref();
onMounted(() => {
  console.log(son.value);
});
</script>
```

但是需要注意，如果想让父组件获取子组件的数据或者方法需要通过 defineExpose 对外暴露,因为 vue3 中组件内部的数据对外“关闭的”，外部不能访问

```
<script setup lang="ts">
import { ref } from "vue";
//数据
let money = ref(1000);
//方法
const handler = ()=>{
}
defineExpose({
  money,
   handler
})
</script>
```

$parent 可以获取某一个组件的父组件实例 VC,因此可以使用父组件内部的数据与方法。必须子组件内部拥有一个按钮点击时候获取父组件实例，当然父组件的数据与方法需要通过 defineExpose 方法对外暴露

```
<button @click="handler($parent)">点击我获取父组件实例</button>
```

### 1.7provide 与 inject

**provide[提供]**

**inject[注入]**

vue3 提供两个方法 provide 与 inject,可以实现隔辈组件传递参数

组件组件提供数据:

provide 方法用于提供数据，此方法执需要传递两个参数,分别提供数据的 key 与提供数据 value

```
<script setup lang="ts">
import {provide} from 'vue'
provide('token','admin_token');
</script>
```

后代组件可以通过 inject 方法获取数据,通过 key 获取存储的数值

```
<script setup lang="ts">
import {inject} from 'vue'
let token = inject('token');
</script>
```

### 1.8pinia

**pinia 官网:https://pinia.web3doc.top/**

pinia 也是集中式管理状态容器,类似于 vuex。但是核心概念没有 mutation、modules,使用方式参照官网

### 1.9slot

插槽：默认插槽、具名插槽、作用域插槽可以实现父子组件通信.

**默认插槽:**

在子组件内部的模板中书写 slot 全局组件标签

```
<template>
  <div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
</style>
```

在父组件内部提供结构：Todo 即为子组件,在父组件内部使用的时候，在双标签内部书写结构传递给子组件

注意开发项目的时候默认插槽一般只有一个

```
<Todo>
  <h1>我是默认插槽填充的结构</h1>
</Todo>
```

**具名插槽：**

顾名思义，此插槽带有名字在组件内部留多个指定名字的插槽。

下面是一个子组件内部,模板中留两个插槽

```
<template>
  <div>
    <h1>todo</h1>
    <slot name="a"></slot>
    <slot name="b"></slot>
  </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
</style>
```

父组件内部向指定的具名插槽传递结构。需要注意 v-slot：可以替换为#

```
<template>
  <div>
    <h1>slot</h1>
    <Todo>
      <template v-slot:a>  //可以用#a替换
        <div>填入组件A部分的结构</div>
      </template>
      <template v-slot:b>//可以用#b替换
        <div>填入组件B部分的结构</div>
      </template>
    </Todo>
  </div>
</template>

<script setup lang="ts">
import Todo from "./Todo.vue";
</script>
<style scoped>
</style>
```

**作用域插槽**

作用域插槽：可以理解为，子组件数据由父组件提供，但是子组件内部决定不了自身结构与外观(样式)

子组件 Todo 代码如下:

```
<template>
  <div>
    <h1>todo</h1>
    <ul>
     <!--组件内部遍历数组-->
      <li v-for="(item,index) in todos" :key="item.id">
         <!--作用域插槽将数据回传给父组件-->
         <slot :$row="item" :$index="index"></slot>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
defineProps(['todos']);//接受父组件传递过来的数据
</script>
<style scoped>
</style>
```

父组件内部代码如下:

```
<template>
  <div>
    <h1>slot</h1>
    <Todo :todos="todos">
      <template v-slot="{$row,$index}">
         <!--父组件决定子组件的结构与外观-->
         <span :style="{color:$row.done?'green':'red'}">{{$row.title}}</span>
      </template>
    </Todo>
  </div>
</template>

<script setup lang="ts">
import Todo from "./Todo.vue";
import { ref } from "vue";
//父组件内部数据
let todos = ref([
  { id: 1, title: "吃饭", done: true },
  { id: 2, title: "睡觉", done: false },
  { id: 3, title: "打豆豆", done: true },
]);
</script>
<style scoped>
</style>
```

## 二、搭建后台管理系统模板

### 2.1 项目初始化

今天来带大家从 0 开始搭建一个 vue3 版本的后台管理系统。一个项目要有统一的规范，需要使用 eslint+stylelint+prettier 来对我们的代码质量做检测和修复，需要使用 husky 来做 commit 拦截，需要使用 commitlint 来统一提交规范，需要使用 preinstall 来统一包管理工具。

下面我们就用这一套规范来初始化我们的项目，集成一个规范的模版。

#### 2.1.1 环境准备

- node v16.14.2
- pnpm 8.0.0

#### 2.1.2 初始化项目

本项目使用 vite 进行构建，vite 官方中文文档参考：[cn.vitejs.dev/guide/](https://cn.vitejs.dev/guide/)

**pnpm:performant npm ，意味“高性能的 npm”。[pnpm](https://so.csdn.net/so/search?q=pnpm&spm=1001.2101.3001.7020)由 npm/yarn 衍生而来，解决了 npm/yarn 内部潜在的 bug，极大的优化了性能，扩展了使用场景。被誉为“最先进的包管理工具”**

pnpm 安装指令

```
npm i -g pnpm
```

项目初始化命令:

```
pnpm create vite
```

进入到项目根目录 pnpm install 安装全部依赖.安装完依赖运行程序:pnpm run dev

运行完毕项目跑在http://127.0.0.1:5173/,可以访问你得项目啦

### 2.2 项目配置

#### 一、eslint 配置

**eslint 中文官网:http://eslint.cn/**

ESLint 最初是由[Nicholas C. Zakas](http://nczonline.net/) 于 2013 年 6 月创建的开源项目。它的目标是提供一个插件化的**javascript 代码检测工具**

首先安装 eslint

```
pnpm i eslint -D
```

生成配置文件:.eslint.cjs

```
npx eslint --init
```

**.eslint.cjs 配置文件**

```
module.exports = {
   //运行环境
    "env": {
        "browser": true,//浏览器端
        "es2021": true,//es2021
    },
    //规则继承
    "extends": [
       //全部规则默认是关闭的,这个配置项开启推荐规则,推荐规则参照文档
       //比如:函数不能重名、对象不能出现重复key
        "eslint:recommended",
        //vue3语法规则
        "plugin:vue/vue3-essential",
        //ts语法规则
        "plugin:@typescript-eslint/recommended"
    ],
    //要为特定类型的文件指定处理器
    "overrides": [
    ],
    //指定解析器:解析器
    //Esprima 默认解析器
    //Babel-ESLint babel解析器
    //@typescript-eslint/parser ts解析器
    "parser": "@typescript-eslint/parser",
    //指定解析器选项
    "parserOptions": {
        "ecmaVersion": "latest",//校验ECMA最新版本
        "sourceType": "module"//设置为"script"（默认），或者"module"代码在ECMAScript模块中
    },
    //ESLint支持使用第三方插件。在使用插件之前，您必须使用npm安装它
    //该eslint-plugin-前缀可以从插件名称被省略
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    //eslint规则
    "rules": {
    }
}
```

##### 1.1vue3 环境代码校验插件

```
# 让所有与prettier规则存在冲突的Eslint rules失效，并使用prettier进行代码检查
"eslint-config-prettier": "^8.6.0",
"eslint-plugin-import": "^2.27.5",
"eslint-plugin-node": "^11.1.0",
# 运行更漂亮的Eslint，使prettier规则优先级更高，Eslint优先级低
"eslint-plugin-prettier": "^4.2.1",
# vue.js的Eslint插件（查找vue语法错误，发现错误指令，查找违规风格指南
"eslint-plugin-vue": "^9.9.0",
# 该解析器允许使用Eslint校验所有babel code
"@babel/eslint-parser": "^7.19.1",
```

安装指令

```
pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser
```

##### 1.2 修改.eslintrc.cjs 配置文件

```
// @see https://eslint.bootcss.com/docs/rules/

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  /* 指定如何解析语法 */
  parser: 'vue-eslint-parser',
  /** 优先级低于 parse 的语法解析配置 */
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  /* 继承已有的规则 */
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  /*
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint（https://eslint.bootcss.com/docs/rules/）
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'error', // 禁止空余的多行
    'no-useless-escape': 'off', // 禁止不必要的转义字符

    // typeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
    '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
    '@typescript-eslint/semi': 'off',

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
    'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
    'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式
  },
}

```

##### 1.3.eslintignore 忽略文件

```
dist
node_modules
```

##### 1.4 运行脚本

package.json 新增两个运行脚本

```
"scripts": {
    "lint": "eslint src",
    "fix": "eslint src --fix",
}
```

#### 二、配置**prettier**

有了 eslint，为什么还要有 prettier？eslint 针对的是 javascript，他是一个检测工具，包含 js 语法以及少部分格式问题，在 eslint 看来，语法对了就能保证代码正常运行，格式问题属于其次；

而 prettier 属于格式化工具，它看不惯格式不统一，所以它就把 eslint 没干好的事接着干，另外，prettier 支持

包含 js 在内的多种语言。

总结起来，**eslint 和 prettier 这俩兄弟一个保证 js 代码质量，一个保证代码美观。**

##### 2.1 安装依赖包

```
pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier
```

##### 2.2.prettierrc.json 添加规则

```
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "all",
  "tabWidth": 2
}
```

##### 2.3.prettierignore 忽略文件

```
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

**通过 pnpm run lint 去检测语法，如果出现不规范格式,通过 pnpm run fix 修改**

#### 三、配置 stylelint

[stylelint](https://stylelint.io/)为 css 的 lint 工具。可格式化 css 代码，检查 css 语法错误与不合理的写法，指定 css 书写顺序等。

我们的项目中使用 scss 作为预处理器，安装以下依赖：

```
pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D
```

##### 3.1`.stylelintrc.cjs`**配置文件**

**官网:https://stylelint.bootcss.com/**

```
// @see https://stylelint.bootcss.com/

module.exports = {
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化
    'stylelint-config-standard-scss', // 配置stylelint scss插件
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,
    'stylelint-config-prettier', // 配置stylelint和prettier兼容
  ],
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  /**
   * null  => 关闭该规则
   * always => 必须
   */
  rules: {
    'value-keyword-case': null, // 在 css 中使用 v-bind，不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的格式
    'property-no-unknown': null, // 禁止未知的属性(true 为不允许)
    'block-opening-brace-space-before': 'always', //大括号之前必须有一个空格或不能有空白符
    'value-no-vendor-prefix': null, // 关闭 属性值前缀 --webkit-box
    'property-no-vendor-prefix': null, // 关闭 属性前缀 -webkit-mask
    'selector-pseudo-class-no-unknown': [
      // 不允许未知的选择器
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略属性，修改element默认样式的时候能使用到
      },
    ],
  },
}
```

##### 3.2.stylelintignore 忽略文件

```
/node_modules/*
/dist/*
/html/*
/public/*
```

##### 3.3 运行脚本

```
"scripts": {
	"lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
}
```

最后配置统一的 prettier 来格式化我们的 js 和 css，html 代码

```
 "scripts": {
    "dev": "vite --open",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "fix": "eslint src --fix",
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
  },
```

**当我们运行`pnpm run format`的时候，会把代码直接格式化**

#### 四、配置 husky

在上面我们已经集成好了我们代码校验工具，但是需要每次手动的去执行命令才会格式化我们的代码。如果有人没有格式化就提交了远程仓库中，那这个规范就没什么用。所以我们需要强制让开发人员按照代码规范来提交。

要做到这件事情，就需要利用 husky 在代码提交之前触发 git hook(git 在客户端的钩子)，然后执行`pnpm run format`来自动的格式化我们的代码。

安装`husky`

```
pnpm install -D husky
```

执行

```
npx husky-init
```

会在根目录下生成个一个.husky 目录，在这个目录下面会有一个 pre-commit 文件，这个文件里面的命令在我们执行 commit 的时候就会执行

在`.husky/pre-commit`文件添加如下命令：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm run format
```

当我们对代码进行 commit 操作的时候，就会执行命令，对代码进行格式化，然后再提交。

#### 五、配置 commitlint

对于我们的 commit 信息，也是有统一规范的，不能随便写,要让每个人都按照统一的标准来执行，我们可以利用**commitlint**来实现。

安装包

```
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

添加配置文件，新建`commitlint.config.cjs`(注意是 cjs)，然后添加下面的代码：

```
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 校验规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

在`package.json`中配置 scripts 命令

```
# 在scrips中添加下面的代码
{
"scripts": {
    "commitlint": "commitlint --config commitlint.config.cjs -e -V"
  },
}
```

配置结束，现在当我们填写`commit`信息的时候，前面就需要带着下面的`subject`

```
'feat',//新特性、新功能
'fix',//修改bug
'docs',//文档修改
'style',//代码格式修改, 注意不是 css 修改
'refactor',//代码重构
'perf',//优化相关，比如提升性能、体验
'test',//测试用例修改
'chore',//其他修改, 比如改变构建流程、或者增加依赖库、工具等
'revert',//回滚到上一个版本
'build',//编译相关的修改，例如发布版本、对项目构建或者依赖的改动
```

配置 husky

```
npx husky add .husky/commit-msg
```

在生成的 commit-msg 文件中添加下面的命令

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm commitlint
```

当我们 commit 提交信息时，就不能再随意写了，必须是 git commit -m 'fix: xxx' 符合类型的才可以，**需要注意的是类型的后面需要用英文的 :，并且冒号后面是需要空一格的，这个是不能省略的**

#### 六、强制使用 pnpm 包管理器工具

团队开发项目的时候，需要统一包管理器工具,因为不同包管理器工具下载同一个依赖,可能版本不一样,

导致项目出现 bug 问题,因此包管理器工具需要统一管理！！！

在根目录创建`scritps/preinstall.js`文件，添加下面的内容

```
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository must using pnpm as the package manager ` +
    ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1)
}
```

配置命令

```
"scripts": {
	"preinstall": "node ./scripts/preinstall.js"
}
```

**当我们使用 npm 或者 yarn 来安装包的时候，就会报错了。原理就是在 install 的时候会触发 preinstall（npm 提供的生命周期钩子）这个文件里面的代码。**

## 三、项目集成

### 3.1 集成 element-plus

硅谷甄选运营平台,UI 组件库采用的 element-plus，因此需要集成 element-plus 插件！！！

官网地址:https://element-plus.gitee.io/zh-CN/

```
pnpm install element-plus @element-plus/icons-vue
```

**入口文件 main.ts 全局安装 element-plus,element-plus 默认支持语言英语设置为中文**

```
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
    locale: zhCn
})
```

**Element Plus 全局组件类型声明**

```
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

配置完毕可以测试 element-plus 组件与图标的使用.

### 3.2src 别名的配置

在开发项目的时候文件与文件关系可能很复杂，因此我们需要给 src 文件夹配置一个别名！！！

```
// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
        }
    }
})
```

**TypeScript 编译配置**

```
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //路径映射，相对于baseUrl
      "@/*": ["src/*"]
    }
  }
}
```

### 3.3 环境变量的配置

**项目开发过程中，至少会经历开发环境、测试环境和生产环境(即正式环境)三个阶段。不同阶段请求的状态(如接口地址等)不尽相同，若手动切换接口地址是相当繁琐且易出错的。于是环境变量配置的需求就应运而生，我们只需做简单的配置，把环境状态切换的工作交给代码。**

开发环境（development）
顾名思义，开发使用的环境，每位开发人员在自己的 dev 分支上干活，开发到一定程度，同事会合并代码，进行联调。

测试环境（testing）
测试同事干活的环境啦，一般会由测试同事自己来部署，然后在此环境进行测试

生产环境（production）
生产环境是指正式提供对外服务的，一般会关掉错误报告，打开错误日志。(正式提供给客户使用的环境。)

注意:一般情况下，一个环境对应一台服务器,也有的公司开发与测试环境是一台服务器！！！

项目根目录分别添加 开发、生产和测试环境的文件!

```
.env.development
.env.production
.env.test
```

文件内容

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/dev-api'
```

```
NODE_ENV = 'production'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/prod-api'
```

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'test'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/test-api'
```

配置运行命令：package.json

```
 "scripts": {
    "dev": "vite --open",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "preview": "vite preview"
  },
```

通过 **import.meta.env** 获取环境变量

### 3.4SVG 图标配置

在开发项目的时候经常会用到 svg 矢量图,而且我们使用 SVG 以后，**页面上加载的不再是图片资源**,

这对页面性能来说是个很大的提升，而且我们 **SVG 文件比 img 要小**的很多，放在项目中几乎不占用资源。

**安装 SVG 依赖插件**

```
pnpm install vite-plugin-svg-icons -D
```

**在`vite.config.ts`中配置插件**

```
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
export default () => {
  return {
    plugins: [
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  }
}
```

**入口文件导入**

```
import 'virtual:svg-icons-register'
```

**使用 svg 图标**

1.在 assets 文件夹下新建 icon 文件夹，专门用于存储 svg 图标

2.在需要使用的地方使用<svg>+<use>来使用 svg 图标

```js
<template>
  <div>
   <!-- svg:图标外层容器结点，内部标签需要与use标签结合使用 -->
   <svg style="width:30px;height:30px;">
    <!-- xlink:href 指定用哪一个图标，
          属性值必须是#icon-图标名字，
          fill=“red”：图标填充的颜色 -->
    <use xlink:href="#icon-car" fill="red"></use>
   </svg>
  </div>
</template>
```

#### 3.4.1svg 封装为全局组件

因为项目很多模块需要使用图标,因此把它封装为全局组件！！！

- 如何改变图标？用 defineProps 接收父组件传递过来的参数，如图标样式、图标颜色（**注意：**:xlink 必须写成动态的，也就是 v-bind 的简写: ）
- 父组件如何传递参数？在组件标签上 xx="xxx"传递 -> <svg-icon name="phone"></svg-icon>

  1.**在 src/components 目录下创建一个 SvgIcon 组件:代表如下**

```js
//封装的组件svgIcon
<template>
  <div>
    //这里可以key-value一致省略value
    <svg :style="{ width, height}">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀，如果不传的话默认为'#icon-'前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: ""
  },
  //svg宽度
  width: {
    type: String,
    default: '16px'
  },
  //svg高度
  height: {
    type: String,
    default: '16px'
  }

})
</script>
<style scoped></style>

//组件标签传值
    <svg-icon name="phone" color="pink" width="100px" height="100px"></svg-icon>
```

2.很多组件都会使用到 svg 组件，所以注册成全局组件 - 但是因为封装的组件过多，不可能每一次都在 main.ts 中注册一次，所以使用自定义插件，把这些自定义组件注册成全局的，在 src 文件夹目录下创建一个 index.ts 文件：用于注册 components 文件夹内部全部全局组件！！！

```js
//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

//全局对象
const allGlobalComponent = { SvgIcon, Pagination }

//对外暴露插件对象
export default {
  //必须要叫install方法
  install(app) {
    //注册项目的全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
  },
}
```

在入口文件引入 src/index.ts 文件,通过 app.use 方法安装自定义插件

```js
import gloablComponent from './components/index'
app.use(gloablComponent)
```

### 3.5 集成 sass

我们目前在组件内部已经可以使用 scss 样式,因为在配置 styleLint 工具的时候，项目当中已经安装过 sass sass-loader,因此我们再组件内可以使用 scss 语法！！！需要加上 lang="scss"

```
<style scoped lang="scss"></style>
```

接下来我们为项目添加一些全局的样式

在 src/styles 目录下创建一个 index.scss 文件，当然项目中需要用到清除默认样式，因此在 index.scss 引入 reset.scss（reset.css 中的内容需要到 npm 官方搜索 reset.scss 然后将内容复制到文件当中）

```
@import reset.scss
```

在入口文件引入

```
import '@/styles'
```

但是你会发现在 src/styles/index.scss 全局样式文件中没有办法使用$变量（$是全局变量）.因此需要给项目中引入全局变量$.

在 style/variable.scss 创建一个 variable.scss 文件！

在 vite.config.ts 文件配置如下:

```
export default defineConfig((config) => {
	css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
	}
}
```

**`@import "./src/styles/variable.less";`后面的`;`不要忘记，不然会报错**!

配置完毕你会发现 scss 提供这些全局变量可以在组件样式中使用了！！！

### 3.6mock 数据

安装依赖:https://www.npmjs.com/package/vite-plugin-mock

```
pnpm install -D vite-plugin-mock@2.9.6 mockjs
```

在 vite.config.js 配置文件启用插件。

```
import { UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
export default ({ command })=> {
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve',
      }),
    ],
  }
}
```

在**根目录**创建 mock 文件夹:去创建我们需要 mock 数据与接口！！！

在 mock 文件夹内部创建一个 user.ts 文件

```
//用户信息数据
function createUserList() {
    return [
        {
            userId: 1,
            avatar:
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            username: 'admin',
            password: '111111',
            desc: '平台管理员',
            roles: ['平台管理员'],
            buttons: ['cuser.detail'],
            routes: ['home'],
            token: 'Admin Token',
        },
        {
            userId: 2,
            avatar:
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            username: 'system',
            password: '111111',
            desc: '系统管理员',
            roles: ['系统管理员'],
            buttons: ['cuser.detail', 'cuser.user'],
            routes: ['home'],
            token: 'System Token',
        },
    ]
}

export default [
    // 用户登录接口
    {
        url: '/api/user/login',//请求地址
        method: 'post',//请求方式
        response: ({ body }) => {
            //获取请求体携带过来的用户名与密码
            const { username, password } = body;
            //调用获取用户信息函数,用于判断是否有此用户
            const checkUser = createUserList().find(
                (item) => item.username === username && item.password === password,
            )
            //没有用户返回失败信息
            if (!checkUser) {
                return { code: 201, data: { message: '账号或者密码不正确' } }
            }
            //如果有返回成功信息
            const { token } = checkUser
            return { code: 200, data: { token } }
        },
    },
    // 获取用户信息
    {
        url: '/api/user/info',
        method: 'get',
        response: (request) => {
            //获取请求头携带token
            const token = request.headers.token;
            //查看用户信息是否包含有次token用户
            const checkUser = createUserList().find((item) => item.token === token)
            //没有返回失败的信息
            if (!checkUser) {
                return { code: 201, data: { message: '获取用户信息失败' } }
            }
            //如果有返回成功信息
            return { code: 200, data: {checkUser} }
        },
    },
]
```

**安装 axios**

```
pnpm install axios
```

最后通过 axios 测试接口！！！

### 3.7axios 二次封装

在开发项目的时候避免不了与后端进行交互,因此我们需要使用 axios 插件实现发送网络请求。在开发项目的时候

我们经常会把 axios 进行二次封装。

**目的:**

1:使用**请求拦截器**，可以在请求拦截器中处理一些业务(开始进度条、请求头携带公共参数)

2:使用**响应拦截器**，可以在响应拦截器中处理一些业务(进度条结束、简化服务器返回的数据、处理 http 网络错误)

在根目录下创建 utils/request.ts

```js
import axios from 'axios'
import { ElMessage } from 'element-plus'
//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
//请求拦截器
request.interceptors.request.use((config) => {
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    //返回一个失败的Promise对象，用来终止Promise链
    return Promise.reject(error)
  },
)
export default request
```

### 3.8API 接口统一管理

在开发项目的时候,接口可能很多需要统一管理。在 src 目录下去创建 api 文件夹去统一管理项目的接口；

比如:下面方式（user 文件夹下的 index.ts）

```js
//统一管理咱们项目用户相关的接口

import request from '@/utils/request'
//这个type是类型别名
import type {

 loginFormData,

 loginResponseData,

 userInfoReponseData,

} from './type'

//项目用户相关的请求地址

enum API {

 LOGIN_URL = '/admin/acl/index/login',

 USERINFO_URL = '/admin/acl/index/info',

 LOGOUT_URL = '/admin/acl/index/logout',

}
//登录接口
export const reqLogin = (data: loginFormData) =>
 request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息

export const reqUserInfo = () =>

 request.get<any, userInfoReponseData>(API.USERINFO_URL)

//退出登录

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
```

```js
//api的user文件夹下的types.ts

//登录接口需要携带参数ts类型
export interface loginForm {
  username: string;
  password: string;
}

//登录接口返回的数据类型
interface dataType {
  token: String;
}
export interface loginResponseData {
  code: Number;
  data: dataType;
}

//定义服务器返回用户信息相关的数据类型
interface userInfo {
  userId: number;
  avatar: string;
  username: string;
  password: string;
  desc: string;
  roles: string[]; //数组字符串
  buttons: string[];
  routes: string[];
  token: string;
}
interface user {
  checkUser: userInfo;
}
export interface userResponseData {
  code: number;
  data: user;
}
```

## 四、项目的资源地址

代码仓库地址:https://gitee.com/jch1011/vue3_admin_template-bj1.git

项目在线文档:

服务器域名:http://sph-api.atguigu.cn

swagger 文档:

商品：http://39.98.123.211:8510/swagger-ui.html#/

用户：http://139.198.104.58:8212/swagger-ui.html#/

echarts:国内镜像网站

https://www.isqqw.com/echarts-doc/zh/option.html#title

http://datav.aliyun.com/portal/school/atlas/area_selector

# 三.路由配置

## 2.1 基本路由配置

1.在 router 文件夹下新建 index.ts 文件，使用 createRouter 创建路由，新建 router 变量接收 createRouter 生成的实例对象，并向外暴露 router

```js
//创建vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes.ts'

//创建路由器
let router = createRouter({
  // 配置路由模式hash，需要引入createWebHashHistory
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为 - 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
```

2.将 router 中的 routes 子路由放在新的文件中方便集中管理，新建 routes.ts 文件，向外暴露 constantRoute 对象

```js
//对外暴露配置的路由
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    name: 'layout',
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
  },
  {
    path: '/:pathMatch(.*)*', //任意路由匹配：以上路由都没有匹配上时会走这里
    redirect: '/404', //重定向到404页面
    name: 'Any',
  },
]
```

3.在 main.ts 中将路由注册为全局路由

```js
import router from '@/router/index.ts'
.use(router)
```

## 2.2 全部路由配置

1.首页一进入会重定向到 Home 首页，也就是进入以及路由'/'后会展示二级路由“home"页

```js
redirect: '/home'
```

2.views 下的/screen 也是一级路由

3.acl 和 product 也是一级路由，用的是 layout 的骨架，所以在 view 中的 acl 和 product 存放的都是二级路由

4.因为有一级路由重定向了，会直接跳转，不需要点，有二级路由的才需要手动点击跳转

5.**注意：**在封装的 menu 组件中，只有一级路由的<template>中也需要设置点击事件，回调函数跟多级路由用的是同一个 goRoute 函数

6.数据大屏的路由/scrren 会跳走的原因是：他不在 layout 下面

# 四.Pinia 仓库配置

1.在 store 文件加下新建 index.ts 文件，作为大仓库，使用 createPinia 创建大仓库

```js
import { createPinia } from 'pinia'
//创建大仓库
let pinia = createPinia()

//向外暴漏大仓库
export default pinia
```

2.在 store 下新建文件夹 modules 里面用于存放小仓库，新建 user.ts 存放用户信息（选择式 API 写法）

```js
//用户信息小仓库

import { defineStore } from 'pinia'
//创建用户小仓库
let useUserStore = defineStore('User', {
  // 存储数据
  state: () => {
    return {
      num: 1,
    }
  },
  // 异步|逻辑
  actions: {},
  //计算属性
  getters: {},
})
//对外暴露获取小仓库的方法
export default useUserStore
```

3.在 main.ts 中注册大仓库

```js
import pinia from '@/store/index.ts'
.use(pinia)
```

4.在页面中使用仓库，**注意**必须要实例化才能生成小仓库

```js
import useUserStore from '@/store/modules/user'
let useStore = useUserStore() //实例化小仓库

onMounted(() => {
  console.log(useStore.num)
})
```

5 Pinia 持久化存储

在这里用的是**本地存储 Localstorage**

# 五.登陆页面

## 1.登录按钮发请求

1.点击登录按钮之后：通知仓库去发登录请求 -> 请求成功：跳转到首页并且存储 token -/ 请求失败：在当前页弹出登录失败的信息

2.async 会返回一个 Promise 对象，Promise 对象有三个状态：pending、fullfill、reject。状态取决于返回的结果，所以可以在成功的回调里 return OK，在失败的回调里 return 一个错误对象，这样当点击登录按钮发请求时就可以知道本次请求是成功还是失败了

```js
  actions: {
    //data的类型是loginForm
    async userLogin(data:loginForm){
      let result:any = await reqLogin(data)
      if(result.code == 200){
        this.token = result.data.token
        localStorage.setItem('TOKEN',result.data.token)
        //能保证当前async函数返回一个成功的promise
        return 'ok';
      }else{
        return Promise.reject(new Error(result.data.message))
      }
    }
  },
```

3.定义 store 仓库中的数据类型 - 1.state 是一个函数，函数返回的对象的类型 2.登录返回的类型

```js
//1.登录返回的类型有code和data，data中又存在登陆成功返回token、登录失败返回message的情况，所以接口需要使用可选参数?:来定义两个数据类型
interface dataType {
  token?: string,
  message?: string
}
export interface loginResponseData {
  code: number
  data: dataType
}

actions: {
//data的类型是loginForm
    async userLogin(data:loginForm){
      let result:loginResponseData = await reqLogin(data)}
}

//2.state函数的返回类型是UserState
export interface UserState {
    //还没有登录的时候是null，登录成功后是string，所以用联合类型 |
    token:null|string
}

//3.token要使用类型断言，只有在返回的是一个字符串的情况下才赋值给this.token
this.token = (result.data.token as string)

//4.将存储数据和获取数据封装成函数，这样可以直接调用
--在utils新建token.ts文件
//存储数据
export const SET_TOKEN = (token:string)=>{
    localStorage.setItem("TOKEN",token)
}
//获取数据
export const GET_TOKEN = ()=>{
    return localStorage.getItem("TOKEN")
}
--在需要使用本地存储的地方引入
import {SET_TOKEN,GET_TOKEN} from '@/utils/token'
  state: ():UserState => {
    return {
      token:GET_TOKEN() //使用获取本地存储函数
    }
  },
action:{
    async userLogin(data:loginForm){
        SET_TOKEN(<string>result.data.token) //使用本地存储函数存储token
    }
}
```

## 2.登录成功的提示框

**需求：**根据用户登录的不同时间，ElNotification 中的 title 显示不同的信息

**思路：**封装一个时间戳函数，获取当前时间是上午、下午、晚上（这里没有用库函数，而是直接用原生的 Date()）

```js
title: `Hi,${getTime()}好`

//在utils文件夹下新建time.ts文件
//获取当前小时的时间
export const getTime = () => {
  let message = ''
  //通过内置对象Date()函数
  let hours = new Date().getHours()
  if (hours <= 9) {
    message = '早上'
  } else if (hours <= 14) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
```

## 3.表单校验

1.在<el-form>上添加:model="" -> 目的是为了告诉表单，将来收集的数据放在哪一个表单上

```js
<el-form :model="loginForm" class="login_form" ref="ruleFormRef" :rules="rules">
```

2.给表单添加规则，在<el-form>上添加:rules="rules"，然后新建表单校验对象

```js
const rules = reactive({
  username: { require: true, message: '请输入用户名', trigger: 'blur' },
  password: { require: true, message: '请输入密码', trigger: 'blur' },
})
```

3.获取表单的 DOM 节点 -> ref ="ruleFormRef" -> cosnt ruleFormRef = ref(null) -> 表单校验规则 validate 方法

```js
ref = 'ruleFormRef'
const ruleFormRef = ref(null)
const login = async () => {
  await ruleFormRef.value.validate()
  /* ... */
}
```

4.自定义表单校验规则（可以用于正则匹配）

```js
const rules = reactive({
  username: [
    //validator:自定义校验规则
  {trigger:'change',validator:validatorUserName}
],
/* ... */
}

//自定义校验规则
const validatorUserName = (_:any,value:any,callback:any)=>{
  //rule为数组的校验规则对象,value为表单校验的文本内容,callback是一个函数，如果符合条件callBack会放行
  if(/^\d{5,10}$/.test(value)){
    callback()
  }else{
    callback(new Error('账号长度至少五位'))
  }
}
```

## 4.Token

**思路：**登录成功后服务器派发了 Token，并且客户端存在了 Pinia 中。再次向服务器发请求获取用户数据的时候，需要在请求头中带上 Token

所有的 token 都是这么玩的！通过请求头携带公共参数，去拿对应这个用户下的所有数据

# 六.首页

## 1.一级路由

- 新建 **layout** 文件夹，将 layout 组件（包含 logo 模块、menu 菜单模块、main 路由出口模块）放在其中，独立封装成一级组件
- 在此路由下的二级路由都会有 layout 里的样式和模板（注意：screen 不在 layout 中，所以没有样式和模板是独立的）
- 把路由出口独立抽出来封装在 main 组件中是为了添加过渡动画

### 1.1 路由组件过渡动画

使用 transition+component 搭配 vue3 的 css 动画 -> .v-enter-from - .v-enter-active - .v-enter-to

```js
<!-- 路由组件出口的位置 - v-slot插槽，会把要显示的组件注入 -->
<router-view v-slot="{ Component }">
    <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
    <component :is="Component"></component>
</transition>

<style lang="scss" scoped>
.fade-enter-from{
    opacity: 0;
}
.fade-enter-active{
    transition: all 0.5s;
}
.fade-enter-to{
    opacity: 1;
}
</style>

```

## 2.侧边栏

1.菜单要抽离封装成组件，因为**菜单要根据配置的路由**来生成菜单，并且路由的名字不能写死，因为不同的项目展示的菜单不一样。**注意：**带有折叠效果的是二级路由。

2.菜单组件需要直接拿到路由数组，所以把路由信息存在小仓库中

```js
import { constantRoute } from '@/router/routes'
state: (): UserState => {
    return {
        /* ... */
      menuRoutes:constantRoute, //路由对象
    }
  },
```

3.ts 会有类型提示，menuRoutes 是一个数组，数组里面放的是路由对象，所以需要定义 menuRoutes 的类型为 vue-router 提供的内置路由类型 RouteRecordRaw

```js
//store下的types
import { RouteRecordRaw } from 'vue-router'
export interface UserState {
  /* ... */
  menuRoutes: RouteRecordRaw[]; //路由数组
}
```

4.在父组件中引入小仓库的路由数组，然后通过组件间通信将数组传给<Menu>组件，父 v-bind 传递，子 defineprops 接收

```js
//父组件
import useUserStore  from '@/store/modules/user'
let userStore = useUserStore()

<Menu :menuList="userStore.menuRoutes" />

//子组件
defineProps(['menuList'])
```

5.动态展示（v-for）路由数组中的数据，用 v-if 来控制当前路由是否有子路由，如果有子路由就使用<el-sub-menu>展示，没有就使用<el-menu>展示，但是展示不能展示路由地址，所以要使用**路由元信息**，给每一个路由起一个标题名字用于展示。

```js
//menu index.vue
<template v-for="(item,index) in menuList" :key="item.path">
    <el-menu-item v-if="!item.children">
        <template #title>
            <span>{{ item.meta.title }}</span>
        </template>
    </el-menu-item>
</template>

//router routes.vue -> meta路由元信息放路由标题
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta:{
      title:'登录', //菜单标题
    }
  },
```

6.Menu 组件中，用 v-if 判断当前路由是否满足以下条件，然后遍历生成侧边栏。如果有多层嵌套的子路由，用<el-sub-menu>加递归嵌套组件实现动态生成可折叠的侧边栏（**注意**：递归组件一定要有名字）

```js
//layout menu index.vue
    <template v-for="(item, index) in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <el-menu-item v-if="!item.children" :index="item.path">
        <template #title>
          <p>标志 &nbsp;</p>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
      <!-- 有子路由，但是只有一个子路由 -->
      <el-menu-item v-if="item.children && item.children.length == 1" :index="item.children[0].path">
        <template #title>
          <p>标志 &nbsp;</p>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
      <!-- 有子路由，且个数大于1 -->
      <el-sub-menu v-if="item.children&&item.children.length>1"  :index="item.path">
        <template #title>
            <span>{{ item.meta.title }}</span>
        </template>
        <!-- 递归组件嵌套 -->
        <Menu :menuList="item.children"/>
      </el-sub-menu>
    </template>

//递归组件的vue2模板语法，给组件起一个名字，不然<Menu>组件不会生效
<script>
export default{
    name:'Menu'
}
</script>
```

7.侧边栏右侧白色边框取消

```js
.el-menu{
    border-right: none;
}
```

8.并不是所有的路由都需要在菜单当中需要展示，所以在路由元信息里加一个 hidden:true/false 用于判断，在封装的 Menu 组件中，每一次判断的外层再嵌套一个<template>用于判断 hidden 为 true 或 false

```js
//routes中
meta:{
      title:'登录', //菜单标题
      hidden:true, //路由标题在菜单中是否隐藏 true:隐藏 false:不隐藏
}

//Menu index.vue
  <template v-if="!item.children">
  <el-menu-item v-if="!item.meta.hidden" :index="item.path">
    <template #title>
      <p>标志 &nbsp;</p>
      <span>{{ item.meta.title }}</span>
    </template>
  </el-menu-item>
</template>
```

9.侧边栏默认激活（选中）的路由组件 => 使用 Menu 提供的 default-ative=“”，可以通过 useRouter 获得当前的路径地址，然后把地址给 default-active 就可以默认激活了

```js
//获取路由对象
import {useRoute} from'vue-router'
let $route = useRoute()

//使用:default-active动态的激活
<el-menu background-color="#787785" text-color="white" :default-active="$route.path">

```

## 3.项目图标

1.把 elementPlus 提供的图标变成全局组件

2.在 components 的 index.ts 中，按照 elementPlus 文档中的步骤

```js
//引入elementPlus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//将elementPlus提供的图标注册为全局组件 - [key,component]:解构出组件的名字和相应的组件，把他们注册成全局组件
console.log(Object.entries(ElementPlusIconsVue))
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

3.图标具体的样式由用户决定，在路由元信息中增加 icon 字段，然后使用<el-icon>搭配<component>

> component:一个用于渲染动态组件或元素的“元组件”。
>
> 1.要渲染的实际组件由 `is` prop 决定。
>
> 2.当 `is` 是字符串，它既可以是 HTML 标签名也可以是组件的注册名。或者，`is` 也可以直接绑定到组件的定义
>
> 3.<component :is="xxx" />

```js
//routes.ts
meta: {
  title: '登录', //菜单标题
  hidden: false, //路由标题在菜单中是否隐藏 true:隐藏 false:不隐藏
  icon:"Promotion", //菜单左侧文字图标，支持elementPlus全部图标
},

//Menu index.vue
<template #title>
    <el-icon>
      <component :is="item.meta.icon"></component> //渲染动态组件或元素的“元组件”
    </el-icon>
    <span>{{ item.meta.title }}</span>
</template>
```

4.点击 item 的时候进行路由跳转

**思路：**利用 elementPlus 提供的 click 方法回调，它会提供 el-menu-item 实例，里面的 index 放着当前路由的路径

## 4.顶部 tabbar

在 layout 中封装成组件 tabbar，然后再把 tabbar 中的左边和右边拆成两个子组件

### 4.1 左侧图标样式切换

**思路：**使用<component>组件+三目运算符控制图标样式切换

1.给 breadcrumb 中 index.vue 中的<el-icon>绑定点击事件 @click="changeIcon"

2.定义一个响应式数据控制图标的切换 => let fold = ref(false)

3.使用 component 动态的控制组件展示 => <component :is="" />

```js
<el-icon style="margin-right: 20px" @click="changeIcon">
    <component :is="fold?'Fold':'Expand'"></component>
</el-icon>

import {ref} from 'vue'
let fold = ref(false)

const changeIcon = ()=>{
  fold.value = !fold.value
}
```

4.根据 fold 的值为 true 或 false 来决定侧边栏宽度要不要发生变化。因为 fold 的值不仅当前组件需要使用，祖先组件也需要，所以将 fold 的值存在仓库中，方便组件间通信

```js
//在store下的modules中新建setting.ts文件，用于存放layout组件相关的数据
import { defineStore } from 'pinia'
let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起的控制
    }
  },
  actions: {
    changeIconAction() {
      this.fold = !this.fold
    },
  },
})
export default useLayOutSettingStore

//在需要使用数据的组件中引入仓库，在回调函数中调用仓库actions中的方法
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
const changeIcon = () => {
  LayOutSettingStore.changeIconAction()
}
```

### 4.2 侧边栏过渡动画

**思路：**

- 根据仓库中 fold 的 true 或 false，动态的给侧边栏追加类名，使用三目运算符判断仓库中的 fold 属性为 true 或 false，来控制侧边栏的折叠与展开
- 侧边栏头顶文字在 logo 文件夹下，使用 v-show 和仓库中 fold 为 true 或 false 来控制它的显示与隐藏
- 给侧边栏的展开与折叠追加动画效果 -> 只需要给侧边栏的 css 添加：transition: width .3s ease;

```js
//layout index.vue中
<div class="layout_slider" :class="{fold:LayOutSettingStore.fold?true:false}">
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

<style lang="scss" scoped>
.layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: skyblue;
    background: $base-menu-background;
    transition: width .3s ease;
    &.fold{
    width: $base-menu-min-width;
}
</stype>

//logo index.vue
<p v-show="!LayOutSettingStore.fold">{{ setting.title }}</p>
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
```

- 同时顶部 tabbar 和内容 main 区域也要根据页面的缩放来调整自己的大小

```js
<div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
<style>
.layout_tabbar {
  transition:all .3s ease;
    &.fold{
      width: calc(100vw - $base-menu-min-width);
      left:$base-menu-min-width;
    }
}
</style>
```

- 侧边栏折叠起来时文字缩放不自然 -> 解决：取消动态类名的 fold 的添加，直接让顶部导航和主体部分压住侧边栏。

### 4.3 面包屑根据路由变化

**思路：**tabbar 动态的展示和匹配侧边栏的一二级路由的组件名字和图标，使用 vue-router 提供的 matched 实现面包屑功能 _`this.$route.matched`_

1.面包屑动态的展示路由 -> 使用路由对象 -> 里面有一个 matched 属性，可以获取到当前的路由（无论一级二级还是三级） -> v-for="(item,index) in $route.matched"

```js
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态生成面包屑 -->
    <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.path" v-show="item.meta.title" >
      <el-icon class="margin-top:20px;width:24px;height:24px;">
        <component :is="item.meta.icon" ></component>
      </el-icon>
      <span style="margin:0 5px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
```

2.点击面包屑的每一项也可以进行路由跳转，只需要使用自带的 to 属性 -> :to="item.path"

3.点击二级路由面包屑的一级路由，就重定向到一级路由，在 routes 中配置 redirect -> redirect:"/acl/user"

### 4.4 点击按钮刷新页面

**思路：**点击刷新按钮后会重新向服务器发请求获取数据，也就是当你点击刷新按钮的时候实际上是销毁二级路由组件再重新创建

1.在 Tabbar 组件下的 Setting 中点击按钮，要通知 Main 组件刷新数据，涉及叔侄组件间通信，所以把数据放到仓库当中，每当这个属性值发生变化时，叔叔组件就可以监听到

- 在 setting 仓库中添加一个属性 refsh，每次一点击按钮的时候就把该属性置反

```js
//setting.js仓库
state:{
    return{
        refsh:false,//用于控制刷新效果
    }
}

//setting.vue 组件
<el-button type="warning" size="small" icon="Refresh" circle @click="updateRefsh"></el-button>

import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()
//刷新按钮点击的回调
const updateRefsh = ()=>{
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
```

- Main 组件上监听仓库 state 的 refsh 数据的变化，refsh 一变化就重新向服务器发请求（watch 第一个参数要写成回调函数形式）

```js
//main index.vue
import { ref, watch } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()

watch(
  () => layOutSettingStore.refsh,
  () => {
    console.log('我变了！')
  },
)
```

- **v-if 可以销毁创建组件**，定义一个变量控制组件是否销毁，然后使用 nextTick 监听数据发生变化，让他看看 DOM 是否更新完毕 - **nextTick**:当响应式数据发生变化后，立刻获取到更新后的 DOM

```js
//main index.vue
<component :is="Component" v-if="flag"></component>

//控制当前组件是否销毁重建
let flag = ref(true)
//监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(()=>layOutSettingStore.refsh,()=>{
  //点击刷新按钮：路由组件需要销毁
  flag.value = false
  //DOM更新后再让flag变回true
  nextTick(()=>{
    flag.value = true
  })
})
```

### 4.5 点击按钮切换全屏模式

**思路：**点击按钮后修改 DOM 样式

DOM 中有一个属性：document.fullscreenElement 来判断当前是否全屏，是的话返回 true，否则返回 null

以及一个方法：requestFullscreen，实现全屏模式 -> document.documentElement.requestFulscreen() ，以及退出全屏模式的方法 -> document.exitFullscreen()

```js
//刷新按钮点击的回调
const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
//全屏按钮点击的回调
const fullScreen = () => {
  //document.fullscreenElement:DOM对象的一个属性，可以用来判断当前是不是全屏模式
  let full = document.fullscreenElement
  if (!full) {
    //文档根节点的方法 requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}
```

### 4.6 下拉菜单退出登录

**思路：**1.退出登录的时候，向服务器发请求，告诉服务器本次登录的 Token 不需要了，下次登录再重新生成一个新 Token。 2.清空 Pinia 中用户相关的数据 3.路由跳转 => 以上直接定义一个方法，一点击就调用 Pinia 中的该方法

```js
//setting index.vue
const logout = ()=>{
  userStore.userLogOut()
  $router.push('/login')
}

//小仓库 setting
//退出登录
userLogOut(){
  //目前没有退出登录的接口（通知服务器本地用户唯一标识失效）
  this.token = ''
  this.username = ''
  this.avatar = ''
  REMOVE_TOKEN()
}
//REMOVE_TOKEN是封装的独立函数，用来清除token
```

**问题：**在当前路由点击退出登录后，再登录时应该是退出登录之前的页面。（也可以回到首页，但是这里做的是保留路由）所以分两种情况：①path 中带着 query 参数就跳转回 query 参数的路径 ②path 中没有 query 参数就跳回首页

**解决：**把当前路由的路径通过 query 参数带给 Login，这样当你再点击登录按钮的时候，就可以回到之前的路由页面了。使用 router.push 跳转的时候可以携带 query 参数 -> 只要是路由上的路径，组件 vc 都可以拿到

![image-20230525172330716](C:\Users\13459\AppData\Roaming\Typora\typora-user-images\image-20230525172330716.png)

那么**问题**又来了：怎么样拿出来 redirect 的 path 呢？ -> 先创建路由信息对象 let $route = useRoute() -> 然后使用$route.query 可以拿到路由当中的 query 信息，因为传递的时候给 query 添加了 redirect 前缀，所以可以通过$route.query.redirect 拿到路径信息

```js
//setting index.vue
const logout = () => {
  userStore.userLogOut()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//login index.vue
import { useRouter, useRoute } from 'vue-router'
let $route = useRoute()
//在login的回调中
let redirect: any = $route.query.redirect
$router.push({ path: redirect || '/' })
```

又有**问题**了：① 登录之后就不能再访问 login 了（用全局守卫判断能不能跳转） ② 使用 query 跳转回来后，用户的头像和昵称没有了（仓库持久化存储(tips:这里没有用持久化，而是用的前置路由守卫，只要酷路由一发生变化，要是仓库中没有用户信息，就调用仓库中的方法重新向服务器发请求获取用户信息，所以可以保证从首页跳转到别的页面后用户信息丢失的问题！！)+目前只有首页获取用户信息，可以把请求放在路由守卫里，只要路由一跳转，守卫就干活）③ 每一次路由跳转的时候还需要有进度条 ④token 要是设置了有效期，在有效期结束之后，用户再点击侧边栏的话应该跳转回 Login 页面（路由守卫解决）

① 路由访问权限设置 - 用 Token 判断用户登录与否 - permission.ts

-用户未登录可以访问 login，其余的路由不能访问（都会重定向到 login）

-用户登录成功后，不可以访问 login，指向首页，其余的路由都可以访问

-在组件外获取仓库的数据时需要**注意**：使用同步无法直接获取到仓库的数据，获取小仓库的数据首先需要有大仓库，所以实例化的时候要传入大仓库

```js
//获取用户相关的小仓库中的token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
let userStore = useUserStore(pinia)

router.beforeEach(async (to: any, from: any, next: any) => {
  nprogress.start()
  //获取token，去判断用户登录还是未登录
  let token = userStore.token
  //获取用户名字
  let username = userStore.username
  if (token) {
    //登录成功，用户访问login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功后可以访问除了登录以外的其他路由
      //用用户信息直接放行
      if (username) {
        next()
      } else {
        //没有用户信息就向服务器发请求获取用户信息后再放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          //什么情况下会走catch分支？ 1.token过期，获取不到用户信息 2.用户手动修改本地存储token
          //1.token过期先退出登录 - 把用户信息清空,回到login页面
          userStore.userLogOut()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      //未登录的情况下在地址栏输入的地址，因为没有token所以去不了，但是会保留用户的输入
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
```

③ 每一次路由切换的时候都需要有进度条

-使用全局前置路由守卫+nprogress 插件

```js
//安装nprogress npm i nprogress
//引入nprogress+它的样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//在前置路由守卫里使用
router.beforeEach((to, from, next) => {
  nprogress.start() //进度条开始
  next()
})
```

# 七.接口配置

由于开发、生产、上线的环境都不一样，所以要把服务器地址抽成全局变量

## 1.loadEnv

- vite 服务器提供了一个方法：loadEnv，当这个方法一执行，会返回当前开发环境对象，环境对象身上包含着当前环境变量身上配置的变量

```js
//引入loadEnv
import { defineConfig,loadEnv } from 'vite'
export default defineConfig(({ command,mode }) => {
  //获取各种环境下的对应的变量，需要传入三个参数（哪一个环境的文件，文件在哪个位置）
  let env = loadEnv(mode,process.cwd())
```

## 2.server.proxy

详情看 Vite 官网的配置信息，下面这个 [env.VITE_APP_BASE_API] 是全局开发环境中的变量.env.development

```js
    //代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          target: env.VITE_SERVE, //获取数据的服务器地址设置
          changeOrigin: true, //需要代理跨域
          rewrite: (path) => path.replace(/^\/api/, ''), //路径重写，把/api替换为空
        }
      }
    }
```

## 3.登录/用户信息/退出登录 接口

1.重写 api 下 user 接口的数据，把 mock 的假接口换成真接口

2.因为 mock 中数据的格式跟真实接口返回的数据格式不一样，所以还要修改仓库中的数据格式

3.点击退出登陆如果成功要跳转到 Login，如果退出登录失败，要弹出相应的错误提示信息。**如何知道**登录请求是否成功还是失败？-> 在仓库中对应的 actions 中 return "ok"或者 return Promise.reject(new Error(result.message))

4.**遇到的问题：**点击登录之后数据回来了但是路由没有跳转 -> 该问题是因为：Pinia 仓库中的 token 和 username 在点击登录后没有拿到（解决了） -> 我真服了你在 actions 中发登录请求的时候直接 let 而不是存在仓库中，所以这个 token 一直为 null 搞得路由守卫不让你进去我真服了你还百度了半天 Pinia 异步我真服了

### 3.1 接口类型重写

把之前 mock 的接口类型全部重写

1.用户登录接口携带参数的 ts 类型

```js
export interface loginFormData{
  username:string,
  password:string
}
//在api user index.ts中使用
import type { loginFormData,loginResponseData } from './types'
export const reqLogin = (data:loginFormData)=> request.post<any,loginResponseData>(API.LOGIN_URL,data)

```

2.全部接口返回数据都拥有 ts 类型

```js
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
```

3.登录接口返回的数据类型（继承自全部接口的类型以外，还有自己的类型 data）

```js
export interface loginResponseData extends ResponseData {
  data: string;
}
```

4.退出接口的类型返回为 null，可以直接定义为 any 类型

### 3.2 修改仓库中数据类型

使用 api 下的 user 里 types.ts 定义好的接口类型

```js
import type { loginFormData,loginResponseData,userInfoReponseData } from '@/api/user/types'
//登录请求的类型
async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
//获取用户信息的类型
async userInfo(){
let result:userInfoReponseData = await reqUserInfo()
//退出登录的类型为any
async userLogOut(){
let result:any = await reqLogout()
```

# 八.商品管理

- 一般都是增删改查
- 当组件一挂载的时候需要向服务器发请求获取数据

## 1.品牌管理

1.组件第一次挂载时，默认请求第一页的数据，对应接口：[GET](http://39.98.123.211:8510/swagger-ui.html#!/21697292602550921475/indexUsingGET_2) [/admin/product/baseTrademark/{page}/{limit}](http://39.98.123.211:8510/swagger-ui.html#!/21697292602550921475/indexUsingGET_2)

接口需要携带参数：page 当前分页器第几页的数据，limit 获取多少条数据

**注意：**get 接口的 query 参数如何封装和携带 **解决：**使用模板字符串

```js
enum API{
    TRADEMARK_URL = '/admin/product/baseTrademark/',
}
export const reqHasTrademark = (page:number,limit:number)=>request.get<any,any>(API.TRADEMARK_URL+`${page}/${limit}`)
```

### 1.1 已有品牌的类型

在 api 下的 product 下的 trademark 下的 types.ts 文件

**注意：**在已有品牌的 ts 数据类型中，已有的品牌是有 id 的，新增的品牌的 id 是需要靠数据库生成的，所以定义接口类型的时候需要用可选属性 ?: 来定义类型

```js
//参数值固定字段类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

//已有的品牌的ts数据类型
export interface TradeMark {
  id?: number;
  tmName: string;
  logUrl: string;
}

//包含全部品牌的TS类型 - 已有品牌类型的数组
export type Records = TradeMark[]

//获取的已有全部品牌的数据ts类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number,
  };
}
```

1.在 api 请求中使用

```js
import {TradeMarkResponseData} from './types.ts'

export const reqHasTrademark = (page:number,limit:number)=>request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)
```

2.在 views 下的 trademark.vue 中使用

```js
import {Records,TradeMarkResponseData} from '@/api/product/trademark/types.ts'

let trademarkArr = ref<Records>([]) //类型是包含全部品牌的Ts类型
const getHasTrademark = async () => {
  let result: TradeMarkResponseData = await reqHasTrademark(currentPage.value, limit.value)
```

### 1.2 分页器页码变化

- 每次点击分页器的时候需要重新向服务器发请求获取数据 @current-change

**思路：**使用 elementPlus 提供的分页器事件@current-change，当分页器页码发生变化后在回调里发请求.

实际上@current-change 就是一个组件自定义事件，它回传了当前的页码（但是目前不需要当前的页码，因为 total 做了双向数据绑定）所以可以直接把 getHasTrademark 作为事件的回调，那么@current-change 就不需要额外写回调函数了

```js
<el-pagination  @current-change="getHasTrademark()" />
```

### 1.3 页面展示条数发生变化

- 分页器下拉菜单里当前页面展示的条数发生变化 @size-change

**思路：**① 分页器下拉菜单也是 element 组件身上的自定义事件，也会向组件注入当前分页器的数量，但是我之前已经双向绑定收集到了当前页面展示的条数，所以只需要在回调函数中调用 getHashTrademark 函数。

② 同时需要让当前页码回到第一页，正常可以在回调函数中写 currentPage.value = 1，简化就是在 getHashTrademark 函数的形参中设置默认值 (page=1)=>{ currentPage.value = page }

```js
<el-pagination  @size-change="sizeChange" />
const sizeChange = ()=>{
	getHasTrademark()
}
```

### 1.4 品牌添加/修改

- 点击添加或者编辑会弹出来一个对话框（dialog）
- 注意 dialog 底部的按钮使用具名插槽 <template #footer> 来显示

#### 1.4.1 新增/修改品牌共用一个方法

- 新增品牌和修改品牌的区别在于 - 新增品牌不需要携带 id，id 由服务器生成，而修改品牌需要携带 id
- 服务器要是返回的数据只有 code 没有 data，也就是 data 为 null，就可以把返回值的类型断言为 any

```js
//新增和修改品牌类型 - 如果data中携带id字段就是修改，否则就是新增
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    request.put < any, any > (API.ADDTRADEMARK_URL, data)
  } else {
    request.post < any, any > (API.UPDATETRADEMARK_URL, data)
  }
}
```

#### 1.4.2 收集品牌名称数据

**思路：**新建一个 reactive 变量 trademarkParams，数据类型是 types 中定义好的 tradeMark 类型，然后使用 v-model 将数据收集到 trademarkParams.tmName 和 trademarkParams.logoUrl 中

#### 1.4.3 收集上传图片数据

**思路：**使用<el-upload>，其中 action 是请求的地址，所以需要先将图片上传到服务器上，然后发请求的时候才可以拿到图片的地址

1.上传图片的地址 [/admin/product/fileUpload](http://39.98.123.211:8510/swagger-ui.html#!/199782025631649297022550921475/fileUploadUsingGET)

- 该地址没有/api，代理服务器不会工作，所以要在 action 的地址中加上/api（接口文档中是没有加的）
- upload 组件自带的 API：①:show-file-list="true" -> 是否显示已上传文件列表 ②:before-upload="beforeAvatarUpload" ->可以约束上传文件的类型 ③:on-success -> 文件上传成功之后的回调，会把图片上传成功之后的地址返回
- 图片和图标谁显示谁隐藏，需要靠 trademarkParams.logUrl 是否为空串来切换，当没有上传图片的时候它为空

```js
<el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="true"
:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
    <img v-if="trademarkParams.logUrl" :src="trademarkParams.logUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>
</el-upload>

let trademarkParams = reactive<TradeMark>({
  logUrl: "",
  tmName: ""
})
//图片上传组件API->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  //约束文件的类型
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    //约束文件的大小
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
//图片上传成功的钩子 - response为请求成功后服务器返回的地址路径
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response:any
) => {
  trademarkParams.logUrl = response.data
}
```

#### 1.4.4 点击确认按钮收集数据

- 发请求返回的是 Promise 对象，所以**别忘记**加 async 和 await
- 添加成功后应该做什么？① 弹出提示信息 ② 对话框关闭 ③ 再捞一次已有品牌的信息 ④ 清空表单信息（点击取消按钮也需要清空，所以可以直接再点击添加品牌时清空，就避免了要写两次）

```js
const confirm = async () => {
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: '添加品牌成功',
    })
    getHasTrademark()
  } else {
    ElMessage({
      type: 'error',
      message: '添加品牌失败',
    })
  }
}
```

#### 1.4.5 清空表单内容

**思路：**因为在<el-dialog>对话框中无论是点击取消还是确定，都会关闭当前对话框，再次点击新增按钮的时候，对话框里面的内容应该清空，所以把清空操作放在点击添加品牌的回调中执行

- <el-upload>提供了一个清空文件显示的方法 clearFiles()，但是使用的时候要配合 ref 获取 DOM 节点+nextTick 钩子函数使用，因为 setup 执行的时候页面 DOM 还未渲染完成，拿不到 ref
- 剩下的名称和 LOGO 只需要清空 reactive 对象中的属性即可

```js
//清除show-file-list的文件信息
const removeImg = () => {
  nextTick(() => {
    picUpload.value.clearFiles()
  })
}

//添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  //清空输入框
  removeImg()
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
}
```

### 1.5 品牌修改

点击修改按钮的时候，当前点击的品牌的信息回回显在 dialog 中

- 因为编辑按钮是放在 template 中，所以可以通过具名插槽的 row 拿到当前品牌的全部信息，把信息放在参数中传递给回调函数。**注意：**row 的类型是 TradeMark 类型
- 此外，修改品牌还需要收集当前 id，可以直接往 reactive 对象上添加新的属性 id -> trademarkParams.id = id

```js
//编辑品牌
const updateTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true / 合并数据
  Object.assign(trademarkParams, row)
}
```

- 修改成功后应该留在当前页，**解决：**判断当前是添加还是修改，如果是修改的话，调用 getHasTrademark()时候应该把当前页传过去 -> getHasTrademark(trademarkParams.id?currentPage.value:1)

#### 1.5.1 恢复到原始状态

> this.$options.data()：这个是 vue 原始的状态，也就是数据一开始声明时候的状态
>
> this.$data：改变后的 data 数据
>
> 在 Vue2 中可以使用 Object.assign(this.$data,this.$options.data())将表单重置到初始状态

- 在 Vue3 中我尝试了 getCurrentInstance 方法拿到 ctx 和 proxy，都无法直接获得 this.$options.data和this.$data

**解决：**直接把 trademark 中的 id 变为 0 就可以解决先点击编辑品牌再点击添加品牌会出现 title 标题错乱的问题，**但是 reactive 中的属性依然存在没有删除**

### 1.6 品牌管理模块的表单验证

- 品牌名称不能小于两位
- 必须都要有内容才可以提交

① 使用:model=""告诉表单把数据收集到了谁的身上(**注意：**这里的双向绑定要绑定在<el-form>上) ② 使用:rules=""传入校验规则 ③ 为表单项(form-item)设置 prop 属性为需要验证的特殊键值

- 使用**自定义校验**规则的时候，要把校验函数放在 rules 前面
- **上传图片**什么时候触发校验规则呢？ **答：**elementPlus 提供了一个表单校验的方法**validate**

```js
const confirm = () => {
  formRef.value.validate(async (valid: boolean) => {}
```

> validate：对整个表单的内容进行验证。 接收一个回调函数，或返回 `Promise`。

- 所以可以获取组件实例，然后在点击确定的时候触发表单校验，解决上传图片表单 trigger 不触发的问题 - 如果自定义验证规则中的 value 值那么就是没有上传图片，如果有值就上传了。

```js
//自定义校验规则
const validatorTmName = (_: any, value: any, callBack: any) => {
  console.log(value)
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数必须大于等于两位'))
  }
}
const validatorLogoUrl = (_: any, value: any, callBack: any) => {
  //如果图片上传了，value里就有值
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }
}
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}
```

- **注意：**点击确定按钮触发校验之后校验失败，关闭 dialog 之后再打开依然拥有图片校验失败提示，需要使用 element 中提供的 API 👇 在点击按钮时清除表单校验结果

> clearValidate：移除该表单项的校验结果

```js
//图片上传成功的钩子 - response为请求成功后服务器返回的地址路径
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  trademarkParams.logoUrl = response.data
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
```

- **注意：**点击添加品牌按钮的时候还没有生成 DOM 节点，所以拿不到<el-form> **解决：** ① 使用 nextTick 钩子函数来获取到 ref 节点 ② 使用 Ts 的可选属性`?` -> formRef.value?.clearValidate('tmName')

```js
//添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  removeImg()
  //清空输入框
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
```

## 2.属性管理

**思路：**根据一级分类的 id 捞二级分类的 id 捞三级分类的数据

- 因为属性管理的头部卡片在其他地方也用到了，所以封装成一个全局组件方便复用，因为直接暴露了所以不需要在组件内引入，只需要直接使用<Category />就可以

### 2.1 三级分类下拉菜单

**思路：**组件一挂载就获取一级分类的数据，然后在<el-option>中使用 v-for 遍历数组，在其中使用:value=""收集当前选中项的 id。将数据通过 v-model 给<el-select>双向绑定

- option 组件的 label 属性为显示文字，value 属性即为 select 下拉菜单收集的数据

```js
<el-form-item label="一级分类" >
        <el-select placeholder="请选择" v-model="c1Id">
          <el-option :label="item.name" v-for="item in c1Arr" :key="item.index" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
```

- 将来父组件还需要使用一、二、三级分类的 id 去捞对应的属性和属性值，通过 table 去展示。如果只把分类 id 存在子组件当中，将来就得涉及到子传父。为了简化步骤，可以**将 id 存在仓库当中**

#### 2.1.1 分类数据存在 Pinia

使用选择式 API

**思路：**当 category 组件一挂载时就通知仓库发请求捞数据，然后将数据存在仓库当中，在组件内使用 v-for 遍历仓库数据展示，同时将收集的数据也存在仓库当中

```js
import { defineStore } from 'pinia'
import { reqGetC1 } from '@/api/product/attr'
let useCategoryStore = defineStore('category', {
  state: () => {
    return {
      c1Arr: [],
      c1Id: '',
    }
  },
  actions: {
    async getC1() {
      let result: any = await reqGetC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
  },
})
export default useCategoryStore
```

#### 2.1.2 三级分类的 ts 数据类型

```js
//api product attr types.ts
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

//分类的ts类型
export interface CategoryObj {
  id: number | string; //id虽然返回的是字符串类型，但是仓库当中存的是number类型
  name: string;
  category1Id?: number;
  category2Id?: number;
  category3Id?: number;
}

//相应的分类接口返回数据的类型 - 继承公共属性ResponseData,里面额外有CategoryObj类型的数组数据
export interface CategoryResponse extends ResponseData {
  data: CategoryObj[];
}
```

#### 2.1.3 定义仓库的 ts 类型

```js
//在store的type下的index.ts中
//定义分类仓库state对象的ts类型
export interface categoryState {
  c1Id: string | number;
  c1Arr: CategoryObj[];
}
```

### 2.2 二三级分类的数据

**问题：**什么时候二级分类向接口发请求？ **答：**① 当一级分类 id 存在的时候发请求捞取二级分类的数据 ② 在<el-select>的 change 回调中发

```js
<el-form-item label="二级分类">
    <el-select placeholder="请选择" v-model="categoryStore.c2Id" @change="handlerC2">
      <el-option :label="c2.name" v-for="c2 in categoryStore.c2Arr" :key="c2.id" :value="c2.id"></el-option>
    </el-select>
</el-form-item>
//一级分类下拉菜单选中值得时候会触发，可以保证一级分类的ID有了
const handler = ()=>{
    categoryStore.getC2()
}
const handlerC2 = ()=>{
    categoryStore.getC3()
}
```

**问题：**当一级分类发生变化的时候，二三级分类的数据得清空

**解决：**在一级分类的下拉菜单的@change 事件中，清掉仓库中关于 c2、c3 的 id

```js
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
```

### 2.3 添加属性按钮禁用

什么时候禁用添加按钮？当仓库中三级分类的 id 不存在时就禁用

```js
<el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id?false:true">添加平台属性</el-button>
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
```

### 2.4 已有属性和属性值的展示

对应接口[GET](http://39.98.123.211:8510/swagger-ui.html#!/2183021697225223078423646246152550921475/attrInfoListUsingGET) [/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697225223078423646246152550921475/attrInfoListUsingGET)

#### 2.4.1 定义接口和数据类型

```js
export const reqAttr = (category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
```

接口对应的 ts 类型 - 由小到大

```js
//属性值对象的ts类型
export interface AttrValue {
  id: number;
  valueName: string;
  attrId: number;
}
//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
  id: number;
  attrName: string;
  category1Id: number;
  categoryLevel: number;
}
//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
//属性接口返回的数据的ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[];
}
```

#### 2.4.2 展示数据

**什么时候向接口发请求?** 当三级分类的 id 存在的时候才发请求，所以要在组件内监听仓库中的数据 **watch**（注意：三级分类得有 id 才发请求，要是没有 id 的话首先得清空数组）

**注意：**如果监听的数据是相应式的话，要写成回调函数形式

```js
watch(
  () => categoryStore.c3Id,
  async () => {
    if (!categoryStore.c3Id) {
      attrArr.value = []
      return
    }
    let result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code == 200) {
      attrArr.value = result.data
    }
  },
)
```

### 2.5 添加/修改 属性和属性值

**思路：**点击添加属性值的时候，底部卡片样式改变。输入属性名的时候底部也会属性值也会出现，并且属性值可以换颜色。点击保存按钮之后就新增属性在页面中

1.定义一个变量用于卡片切换 **v-show**

```js
let scene = ref<number>(1)
<div v-show="scene == 0">
<div v-show="scene == 1">
```

2.切换场景 1 后，点击取消按钮可以回到场景 0

```js
//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
```

3.添加新的属性值的时候，要禁用顶部的下拉菜单（因为是给当前的属性添加属性值）使用**父子组件通信** v-bind+props

```js
<Category :isForbidden="scene"/>

//子组件
<el-select v-model="categoryStore.c1Id" @change="handler" placeholder="请选择" :disabled="isForbidden" >
defineProps(['isForbidden'])
```

#### 2.5.1 给三级分类 添加/修改 属性

对应接口:[POST](http://39.98.123.211:8510/swagger-ui.html#!/2183021697225223078423646246152550921475/saveAttrInfoUsingPOST) [/admin/product/saveAttrInfo](http://39.98.123.211:8510/swagger-ui.html#!/2183021697225223078423646246152550921475/saveAttrInfoUsingPOST)

**思路：**带的参数中有 id 就是修改，没有 id 就是新增，两个请求共用一个接口

> //修改需要携带的参数
>
> {
> "attrName": "string", //已有的属性的名字
> "attrValueList": [
>
> > {
> > "attrId": 0, //属性值归属于哪一个属性
> > "id": 0, //已有的属性值的 ID
> > "valueName": "string"
> > }
> > ],
> > "categoryId": 0, //已有的属性归属于那个三级分类
> > "categoryLevel": 0, //代表的是几级分类
> > "id": 0 //已有的属性的 ID
> > }

#### 2.5.2 添加属性

- 输入属性名后，添加属性值按钮才可以点击， 每次一点击就 push 一个空对象到 attrParams 的 attrValueList 中，然后通过双向绑定收集数据到对象中
- 此外还需要三级分类的 ID，在点击添加属性值按钮的时候可以收集到。
- 在保存按钮的回调中发请求，在成功的回调中切换场景并且再次获取分类属性相关信息

```js
//保存按钮的回调
const save = async () => {
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    getCList()
  }
}
```

- 此外，**别忘了要清除数据**，在添加属性按钮点击的回调中清空（只需要使用 Object.assign 把原对象赋值给原数组即可）

```js
//添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候先清空数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  scene.value = 1
}
```

#### 2.5.3 查看/编辑 模式切换

- 文本框失去焦点的时候变成纯文本，一点击又从文本变回文本框，也就是编辑和查看来回切换

**问题：**如何控制<el-input>的显示与隐藏？

**答：**① 定义一个响应式数据控制编辑模式与查看模式的切换 ② 但是一个属性的属性值有多个，如果只用一个变量去控制，就会造成全部都切换 ③ 有多少个属性值就有多少个对象，直接往对象身上追加属性用来控制模式切换

- 注意：模式切换的时候，input 框中的内容不能为空，如果为空，弹出提示信息并且将当前项从数组中干掉：splice(当前下标,1)
- 并且输入框输入的内容不能重复 ：find(item=>{})，如果重复了也需要 splice 干掉当前项

```js
<template #="{ row,$index }">
      <el-input placeholder="请输入属性值名称..." v-model="row.valueName" v-if="row.flag" @blur="toLook(row)"/>
      <div v-else @click="toEdit(row)">{{ row.valueName }}</div>
</template>

//添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag:true, //控制每一个属性值编辑模式与切换模式的切换
  })
}
//输入和查看模式切换
const toLook = (row:AttrValue,$index:number)=>{
  //非法情况1：输入不能为空
  if(row.valueName.trim() == ''){
  //将input输入为空的从数组中干掉
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type:'error',
      message:'请输入属性值'
    })
    return
  }
  //非法情况2：输入不能重复
  let repeat:any = attrParams.attrValueList.find(item =>{
    //判断除了当前项以外的其他项
    if(item!=row){
      return item.valueName === row.valueName
    }
  })
  if(repeat){
    //将重复的属性值从数组中干掉
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type:'error',
      message:'输入的属性值重复'
    })
    return
  }
  row.flag = false
}
const toEdit = (row:AttrValue)=>{
  row.flag = true
}
```

#### 2.5.4 表单元素聚焦

> 在 vue3 中，ref 不仅可以写成字符串形式，也可以写成函数形式，ref=""或 :ref="function"

**思路：**定义一个 ref 数组，用来存储对应的组件实例<el-input>，然后使用函数式 ref 来收集 input 的 DOM，使用饿了么提供的内置函数.focus()来实现聚焦

**问题：**怎么样拿到数组当中的组件实例？**为什么拿不到？**响应式数据刚变成真，v-if 语句需要开始渲染页面，渲染页面需要耗时间，所有无法第一在响应式数据刚发生变化就拿到 DOM

**解决：**使用 nextTick 获取响应式数据更新后的 DOM（**注意了！**获取 DOM 节点要在 nextTick 函数中！！！）

1.点击切换文本框并且聚焦

```js
const toEdit = (row: AttrValue, $index: number) => {
  console.log($index)
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
```

2.点击添加属性值按钮时聚焦**数组最后一项**（inputArr.value[attrParams.attrValueList.length-1]就是数组最后一项）

```js
//添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
  //获取最后的<el-input>组件的DOM，让它聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
```

### 2.6 删除属性值

**思路：**给删除按钮绑定点击事件，传入$index，然后使用 splice 方法干掉数组中对应的属性值

```js
//删除按钮
const deleteArr = ($index: number) => {
  attrParams.attrValueList.splice($index, 1)
}
```

### 2.7 修改已有属性值

> 修改引用类型数据的时候一定注意是否对象里面陶对象，如果是的话一定要使用**深拷贝**

**思路：**点击已有属性的时候不仅要切换页面，而且需要将已有的属性展示在页面页面中。① 当点击编辑的时候，拿到当前的属性对象 row ② 将已有的属性对象赋值给 attrParams 对象 ③ 使用**Object.assign()**方法进行合并

**注意：**

1.因为修改和添加属性值共用的是同一个接口，只是利用是否有 id 来区分是修改还是添加。

2.Object.assign 方法是浅拷贝（两个数组指向同一个对象），就算取消了新增，场景 0 还是会展示新增的属性值。 **解决：**把数组深拷贝一份

```js
const updateAttr = (row: Attr) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
```

### 2.8 删除属性

定义接口 -> 定义类型 -> 引入接口 -> 发送请求

```js
//删除属性
const deleteAttr = async (row:Attr) => {
  const {id} = row
  let result:AttrResponseData = await reqDeleteAttr(id as number)
  if(result.code == 200){
    getCList()
  }
}
```

**注意：**路由跳转的时候组件因为使用的是 v-if，所以销毁重建了，但是 Pinia 仓库中的数据并没有清空。**解决：**使用**onBeforeUnmount**钩子函数在**路由组件销毁**的时候（从当前路由组件切换到别的组件再切回来），使用**$reset**方法把仓库分类相关的数据清空

```js
onBeforeUnmount(() => {
  categoryStore.$reset()
})
```

## 3.SPU 管理

> SPU：电商术语，代表的是一个标准化产品单元

### 3.1SPU 数据展示

**思路：**当三级分类有的时候发请求拿数据，然后展示数据

对应接口：[/admin/product/{page}/{limit}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/indexUsingGET_7)，需要携带三个参数：page、limit、category3Id

```js
import request from "@/utils/request";
enum API{
    //获取已有的SPI数据，需要携带三个参数
    HASSPU_URL = '/admin/product/',
}
const reqGetSPU = (page:number,limit:number,category3Id:number|string)=>request.get<any,any>(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`)
```

**注意：**要监听仓库中三级分类是否有了再发请求，用**watch**而不是页面一挂载就发请求

### 3.2 场景切换

因为 SPU 涉及到三个场景的切换，所以可以封装成一个组件。

> v-if 和 v-show 都可以实现显示与隐藏，但是 v-show 只需要挂载一次不会销毁重建，但是 v-if 会销毁再次创建组件

#### 3.2.1 scene 从 1 到 0 - 自定义事件

在场景 0 点击取消按钮的时候，通知父组件修改 scene 的值 - 子传父使用自定义事件 **v-on+emit**

```js
//父组件
const changeScene = (val: number) => {
  scene.value = val
}
//子组件
let $emit = defineEmits(['changeScene'])
const cancel = () => {
  $emit('changeScene', 0)
}
```

### 3.3 修改 SPU 数据

#### 3.3.1SPU 数据展示

点击修改按钮后需要发四个请求，因为原本父组件中请求的数据不是完整的，所以还需要依赖三级分类的 id 再次向服务器发请求捞数据

> 1.获取所有品牌的数据的接口：[/admin/product/baseTrademark/getTrademarkList](http://39.98.123.211:8510/swagger-ui.html#!/21697292602550921475/getTrademarkListUsingGET)
>
> 此外，Spu 名称的下拉菜单也需要发请求，Spu 照片也需要发请求，Spu 销售属性也需要发请求
>
> 2.获取 Spu 照片墙的数据的接口 - 需要携带的参数：当前商品的 id：[GET](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/getSpuImageListUsingGET) [/admin/product/spuImageList/{spuId}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/getSpuImageListUsingGET)
>
> 3.获取 Spu 列表下的销售属性 - 需要携带的参数：当前商品的 id：[GET](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/getSpuSaleAttrListUsingGET) [/admin/product/spuSaleAttrList/{spuId}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/getSpuSaleAttrListUsingGET)
>
> 4.获取 Spu 列表下一共有多少个销售属性：[GET](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/getBaseSaleAttrListUsingGET) [/admin/product/baseSaleAttrList](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/getBaseSaleAttrListUsingGET)
>
> 上面四个接口用于展示数据，下面的接口用于更新服务器里的数据
>
> 1.更新 SPU：[POST](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/updateSpuInfoUsingPOST) [/admin/product/updateSpuInfo](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/updateSpuInfoUsingPOST)
>
> 2.添加一个 SPU：[POST](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/saveSpuInfoUsingPOST) [/admin/product/saveSpuInfo](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/saveSpuInfoUsingPOST)

**问题：**① 上面四个请求什么时候发送？点击按钮的时候发送

- 使用 ref 拿到子组件的 vc 实例，然后父组件就可以调用子组件内部的方法。用这种方法就可以在子组件内部发请求而不需要在父组件身上发完请求后再传递给子组件了
- **注意：**父组件想要通过 ref 拿到子组件身上的方法和属性，子组件必须要先暴露 **defineExpose({})**
- 注意了：父组件获取子组件的方法的话正常需要使用 nextTick，但是这里使用了 v-show，组件只是隐藏和展示，没有涉及组件卸载和挂载

```js
//父组件
<SpuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene"/>
    //修改已有的SPU按钮的回调
const updateSpu = async (row:SpuData) =>{
  scene.value = 1
  //调用子组件实例方法获取完整的已有的SPU的数据
  spuForm.value.initHasSpuData(row)
}

//子组件
//存储父传递过来的spu对象
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
const initHasSpuData = async (spu:SpuData) =>{
    SpuParams.value = spu
    let {id} = spu
    //获取全部品牌的数据
    let result:AllTradeMark = await reqAllTrademark()
    //获取某一个品牌旗下全部售卖商品的图片
    let result1:SpuHasImg = await reqImage((id as number))
    //已有的销售属性的接口
    let result2:SaleAttrResponseData = await reqSpuHasSale((id as number))
    //获取整个项目全部SPU的销售属性
    let result3:HasSaleAttrResponseData = await reqAllSaleAttr()

    AllTradeMark.value = result.data
    imgList.value = result1.data
    saleAttr.value = result2.data
    allSaleAttr.value = result3.data
}
```

#### 3.3.2 SPU 图片信息收集

1.使用 v-model 将数据展示在页面上

> <el-upload>展示多张图片用的是 v-model:file-list="响应式数组"

2.收集上传的图片数据，通过 action 向接口请求发送(**注意：**接口请求一定要带/api) action="/api/admin/product/fileUpload"

> action：上传图片的接口地址
>
> list-type：文件列表的类型

**注意：**照片墙通过 action 上传的图片信息里面的是 name 和 url，但是服务器需要的是 imgName 和 imgUrl，所以收集数据的时候还需要改一下对应的字段

3.点击预览图片，会弹出 dialog 对话框，其中图片的 src 地址由点击预览图片的回调中的参数 file 提供，

```js
//图片预览
const handlePictureCardPreview = (file: any) => {
  dialogImage.value = file.url
  dialogVisible.value = true
}
```

4.使用 upload 提供的钩子函数 **before-upload** 约束上传的文件类型

```js
//上传图片之前触发的钩子函数
const beforeAvatarUpload = (rawFile: any) => {
  //约束文件的类型
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    //约束文件的大小
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
```

#### 3.3.3 SPU 销售属性收集

1.属性值的展示因为是在对象中嵌套的对象中，所以需要使用插槽，并且样式时 element 的 tag

**注意：**插槽中的 row 为当前销售属性的对象，需要展示的是销售属性对象的额属性值，所以 v-for 遍历的是 row.spuSaleAttrValueList

```js
<el-table-column label="属性值">
                    <template #="{ row }">
                        <el-tag v-for="tag in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable
                            @close="handleClose(tag)">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-button type="success" size="small" icon="Plus" style="margin:0 10px;"></el-button>
                    </template>
                </el-table-column>
```

2.删除当前属性值，只需要使用 splice($index,1)就可以从收集到的数组中删除数据

```js
<template #="{row,$index}">
                        <el-button icon="Delete" type="danger" size="small" @click="saleAttr.splice($index,1)"></el-button>
                    </template>
```

3.销售属性下拉框剩余数据展示

**思路：**将已有的销售属性在全部销售属性中过滤，未收集的数据展示在下拉菜单中，使用**computed**计算出来，其中使用 filter 搭配 every 遍历数组中的所有数据，不满足回调函数中的逻辑的就返回

```js
<el-select :placeholder="`还有${unSelectSaleAttr.length}种选择`" v-model="SpuParams.spuSaleAttrList">
    <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"
        :value="item.id"></el-option>
</el-select>
//当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(()=>{
    let unSelectArr = allSaleAttr.value.filter((item)=>{
        return saleAttr.value.every(val =>{
            return item.name != val.saleAttrName
        })
    })
    return unSelectArr
})
```

4.在<el-option>中收集多个属性使用模板拼接，然后整理数据的时候需要使用字符串拆分，把两个数据从中间分开。

```js
<el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`"></el-option>
```

5.定义一个变量收集还未选择的销售属性的 id 与属性的名字，将数据收集到<el-select>上

```js
<el-select :placeholder="`还有${unSelectSaleAttr.length}种选择`" v-model="saleAttrIdAndValueName">
```

6.销售属性的按钮是否禁用，取决于 saleAttrIdAndValueName 是否收集到了数据

```js
<el-button :disabled="saleAttrIdAndValueName?false:true" type="primary" icon="Plus" style="margin:0 10px;">添加销售属性</el-button>
```

7.一点击添加按钮就往 saleAttr 数组当中 push，但是 push 时候要注意数据需要收集的字段。添加完后还需要清空下拉菜单中收集的数据

```js
const addSaleAttr = () => {
  let attr = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId: attr[0],
    saleAttrName: attr[1],
    spuSaleAttrValueList: [],
  }
  //往数组中追加数据
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}
```

8.销售属性点击加号会显示一个<el-input>，也就是出现 input 的时候隐藏按钮，出现按钮的时候隐藏 input。**注意：**不能单纯的使用一个变量来控制所有的 input 和 button 的显示与隐藏，要往 saleAttr 数组中追加属性值。

```js
//往数组中追加flag
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
const toLook = (row: SaleAttr) => {
  row.flag = false
}
```

**问题 1：**怎么样获取输入的属性值？**答：**动态的往数组中追加对象，因为模板中的 row 拿到的是当前的每一项，所以往数组中追加也是追加到当前项，需要注意的是：字段需要先整理了再追加

```js
//表单元素失去焦点的回调
const toLook = (row:SaleAttr) => {
    row.flag = false
    //整理收集到的属性值的ID与属性值的名字
    const {baseSaleAttrId,saleAttrValue} = row
    let newSaleAttrValue:SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName:(saleAttrValue as string)
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
}
```

往数组中 push 的时候还需要加条件，判断非法情况，比如说：空的内容 不能收集，重复的内容不能收集。**问题 2：**怎么样删除空的 tag 和重复的 tag 呢？**答：**为空时直接 return，就可以不往数组中追加，这样就避免了输入为空。判断属性值是否重复可以用 find 方法在数组中查找，然后 retrun 出去用变量接收，判断变量是否为 true，如果为 true 就 return

```js
const toLook = (row:SaleAttr) => {
    row.flag = false
    //整理收集到的属性值的ID与属性值的名字
    const {baseSaleAttrId,saleAttrValue } = row
    if((saleAttrValue as string).trim() == ''){
        ElMessage({
            type:'error',
            message:'当前输入为空！'
        })
        return
    }
    //判断属性值在数组当中是否存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if(repeat){
        ElMessage({
            type:"error",
            message:"属性重复，请重新输入！"
        })
        return
    }
```

9.点击 tag 的 x 号就删除当前 tag，通过 v-for 的 index 可以拿到当前 tag 的 index，使用 splice 方法就可以删掉当前 tag 了

```js
//属性值的tag关闭
const handleClose = (row: any, index: number) => {
  row.spuSaleAttrValueList.splice(index, 1)
}
```

10.点击保存按钮收集全部信息向服务器接口发请求

**思路：**① 整理参数 ② 发请求->可能是添加也可能是更新，看携带的数据里有没有 id ③ 获取成功和失败的结果

① 整理照片墙数据，收集的时候照片的数据和需要收集的数据的字段不一样，所以需要改为接口需要的数据的名字 **map 方法遍历数组，return 的时候将新的名字 return 出去**

```js
const save = () => {
  //1.照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
}
```

② 整理销售属性的数据

```js
SpuParams.value.spuSaleAttrList = saleAttr.value
```

11.向接口发请求，成功就通知父组件切换场景值

```js
let result:any = await reqAddOrUpdateSpu(SpuParams.value)
if(result.code == 200){
    ElMessage({
        type:'success',
        message:SpuParams.value.id?'更新成功':'添加成功'
    })
    $emit('changeScene', 0)
```

### 3.4 添加 SPU

**思路：**点击按钮的时候获取子组件实例，调用子组件方法让他去发两个请求，获取已有的销售属性和属性值。

#### 3.4.1 初始化请求方法

**思路：**在子组件中定义一个方法，向服务器发请求获取数据，并使用 defineExpose 对外暴露使父组件可以使用此方法

```js
const initAddSpu = () => {
  console.log('我是子组件')
}
defineExpose({ initAddSpu })
```

#### 3.4.2 子组件发请求获取数据

父亲身上有 c3Id，调用子组件身上的方法的时候需要将 c3Id 传过去

```js
const initAddSpu = async (c3Id: number | string) => {
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result1: AllTradeMark = await reqAllTrademark()
  //获取全部销售属性的数据
  let result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数据
  AllTradeMark.value = result1.data
  allSaleAttr.value = result2.data
}
```

#### 3.4.3 清空数据

- 点击添加一个新的 SPU 按钮的时候，除了 spuParams 的数据以外，照片墙和属性值数组的数据也要清空

```js
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''

  /* ... */
}
```

#### 3.4.4 修改成功留在当前页，添加回到第一页

**问题：**如何让父组件知道当前是添加还是更新呢？ **答：**在 emit 里使用对象将场景值和当前状态传递过去，然后父组件接收并使用传过来的对象

```js
//子组件
$emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
//父组件 - 切换场景的回调函数
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getSpuData(pageNo.value)
  } else {
    getSpuData()
  }
}
```

### 3.5 添加 sku

**注意：**表单项里面也可以放表单

每一次点击添加按钮，每一个 SPU 已有的销售属性都是不一样的，所以每一次点击按钮都需要发三个请求。通过 ref 使父组件拿到子组件实例，触发子组件内部方法，在子组件内部发请求

```js
<SkuForm v-show="scene == 2" ref="skuForm" @changeScene="changeScene"/>
const addSku = () =>{
  scene.value = 2
  skuForm.value.initSkuData()
}
```

我真服了，没给子组件绑定事件就在那一直用 emit 妄想触发事件！！

#### 3.5.1 在子组件内发请求

使用的接口是 api 下的 attr 下面的 reqAttr 方法获取属性，以及 spu 下的 reqImage 接口获取照片墙数据和获取某一个已有的销售属性 reqSpuHasSale

需要发三个请求 ① 第一个接口需要三级分类的三个 id ② 需要已有的 spu 的 id->已有的 id 和三级 id 都在 row 里，传递 row 给子组件就可以拿到 category3Id 和 spuId

```js
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  let c1 = c1Id
  let c2 = c2Id
  //获取平台属性
  let result: any = await reqAttr(c1, c2, spu.category3Id)
  //获取对应的销售属性
  let result1: any = await reqSpuHasSale(spu.id)
  //获取照片墙数据
  let result2: any = await reqImage(spu.id)

  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}
```

#### 3.5.2 点击保存发请求

对应接口：[POST](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/updateSkuInfoUsingPOST) [/admin/product/updateSkuInfo](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/updateSkuInfoUsingPOST)

[POST](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/saveSkuInfoUsingPOST) [/admin/product/saveSkuInfo](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/saveSkuInfoUsingPOST)

1.收集数据

- 父类传递过来的数据中就有 category 相关的数据
- <el-input>只需要使用 v-model 既可完成双向数据绑定
- 平台属性需要收集属性 id 和属性名，所以使用模板字符串配合:value 收集多个数据 -> :value="`${item.id}:${val.id}`"。**数据收集到哪里呢？**将每个数据收集到当前列下的新添加的字段 saleAndAttr 身上

```js
  <el-select v-model="item.attrIdAndValueId">
    <el-option v-for="val in item.attrValueList" :key="val.id" :label="val.valueName" :value="`${item.id}:${val.id}`"></el-option>
  </el-select>
```

2.把图片设置为默认

- 将当前图片对象传递给点击事件的回调函数
- 将 row 中的 imgUrl 赋值给 skuParams 数组中对应的字段，同时点击设置默认按钮的时候，前面的复选框应该勾选上

**问题：**怎么知道 table 的 select 是否选中？

**答：**得获取到 DOM，才能操作 DOM。再配合上 Table 的方法 toggleRowSelection，直接在设为默认的回调里使得点击设置为默认的同时将复选框选中

> `toggleRowSelection`：用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否

```js
const handler = (row: any) => {
  console.log(table.value)
  //复选框选中
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
```

**注意：**按照上面的选中方法当 table 有多列的时候，点击选中会全部选中。

**解决：**使用排他思想，点击的时候先让全部不选中，再让点击的当前项选中

```js
const handler = (row: any) => {
  console.log(table.value)
  //复选框选中
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
```

3.保存按钮

① 整理参数 ② 发请求 ③ 成功或者失败的处理

（1）平台属性的收集

**思路：**① 用 for 循环遍历 attrArr 数组，如果当前项有 attrIdAndValueId 这个属性，就拿出来，组合成一个新的数组。

②**重点：**使用 reduce 累加，用一个变量来接收，它的起始值是一个空数组，它的回调有两个参数(pre,next)，遍历 attrArr 中的每一项元素，如果它有 attrIdAndValueId 这个属性，就把这个属性先使用 split 切成一个数组，再用需要收集的字段来接收它们，接着往新数组的当前项中 push split 出来的元素。**注意：**reduce 接收的是最后一轮返回的结果，所以在最后需要 return prev

```js
const save = () => {
  //整理数据
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
}
```

（2）销售属性

**思路：**因为销售属性也是多个下拉菜单组成，所以也可以使用 reduce+split+push 方法过滤数据

```js
skuParams.skuSaleAttrValueList = saleArr.value.reduce(
  (prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [attrId, valueId] = next.saleIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  },
  [],
)
```

（3）发请求通知服务器添加新的 SKU

- 返回值为 200 的时候使用 emit 通知父组件切换场景值

```js
//发请求
let result: any = await reqAddSku(skuParams)
if (result.code == 200) {
  ElMessage({
    type: 'success',
    message: '添加成功！',
  })
}
$emit('changeScene', { flag: 0, params: '' })
```

### 3.6 展示 SKU

对应接口：根据 spuid 去找 sku[GET](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/findBySpuIdUsingGET) [/admin/product/findBySpuId/{spuId}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SKU2550921475/findBySpuIdUsingGET)

**思路：**点击查看 SKU 列表并且弹出<el-dialog>

### 3.7 删除 SKU

对应接口：[DELETE](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/deleteSpuUsingDELETE) [/admin/product/deleteSpu/{spuId}](http://39.98.123.211:8510/swagger-ui.html#!/2183021697SPU2550921475/deleteSpuUsingDELETE)

**思路：**删除成功后再次发请求获取全部 SPU 数据，并且每次路由跳转的时候要清除三级分类的数据 -> 使用**onBeforeUnMounted**钩子，在组件即将销毁的时候清空仓库的数据

```js
//清空仓库的数据
onBeforeUnMounted(() => {
  categoryStore.$reset
})
```



# 九.权限管理

## 1.用户管理

### 1.1获取管理用户分页列表

对应接口：[GET](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/indexUsingGET) [/admin/acl/user/{page}/{limit}](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/indexUsingGET)

样式布局方面注意：<el-table>每一列溢出隐藏只需要在<el-table-column>上添加show-overflow-tooltip即可

### 1.2新增用户

对应接口：

新增 [POST](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/saveUsingPOST) [/admin/acl/user/save](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/saveUsingPOST)

**注意：**添加完或者取消添加后先得清空用户数据  - 用**Object.assign** - 将原对象和新对象进行合并！！！

```js
Object.assign(UserParams, {
    username: '',
    name: '',
    password: ''
})
```

- **表单校验**需要拿到form组件实例才可以，并且每次点击添加用户的时候需要清理某个字段的表单验证信息 - 使用element提供的 **clearValidate**
- 第一次点击添加用户按钮的时候，组件还没有挂载完毕，所以是没有<el-form>的，这时候要对表单校验进行清除，就需要用到nextTick
- **注意：**如果表单校验的规则里触发的时机是change时，clearValidate就会出现问题

```js
let userForm = ref<any>(null)
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
}
//校验用户名字的回调函数
const validatorUsername = (rule: any, value: any, callBack: ant) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//添加用户
const addUser = () => {
  //清除上一次表单校验的提示信息
  nextTick(()=>{
    userForm.value.clearValidate('username')
    userForm.value.clearValidate('name')
    userForm.value.clearValidate('password')
  })
```

### 1.3修改用户

对应接口：修改[PUT](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/updateByIdUsingPUT) [/admin/acl/user/update](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/updateByIdUsingPUT)

- 在点击编辑的时候，**首先**将点击的数据通过Object.assign复制给UserParams数组
- 然后修改用户时，不需要用户密码那一行，所以在<el-form-item>中使用v-if判断当前数组中是否有id这个字段，没有就展示密码输入
- 发完请求后应该留在当前页，所以发请求的时候判断一下UserParams中是否有id，如果有id就留在当前页（修改），如果没有就回到第一页（新增）

```js
getHasUser(UserParams.id?pageNo.value:1)
```

### 1.4当前用户修改

- **问题：**修改当前账号的信息后（自己修改自己的账号），应该查询是否有当前用户信息，没有就回到登录页

**解决：**使用 **window.location.reload()**方法，浏览器自动刷新



### 1.5用户角色分配

#### 1.5.1 页面 - checkbox

**问：**点击编辑角色按钮之后，怎么将当前点击的用户信息传递给抽屉组件？

**答：**将row赋值给数组UserParams，然后使用v-model="UserParams.username"展示在页面上

- 静态页面 - 复选框<el-checkbox>   多组复选框<el-checkbox-group>+<el-checkbox>

> checkbox中的属性：①indeterminate - 设置不确定的状态，仅设置样式   ②change - 当全选的复选框发生变化时会触发
>
> checkbox-group中的v-moel：数据双向绑定收集，**注意：**数据一定要收集到响应式数组中，如果不是响应式的，checkbox会勾不上
>
> 复选框全选/全不选：<el-checkbox>的@change回调中提供一个val参数，点击全选时val为true，那么就可以判断，当val为true的时候，让全选对应的数组变为已有的全部属性的数组，否则就为空数组。同时修改indeterminate的状态值为false

```js
<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handlerCheckAllChange">Check all</el-checkbox>

let handlerCheckAllChange = (val:boolean) =>{
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
```

> 同时<el-checkbox-group>也要绑定@change事件，当所有的复选框都勾上的时候，头顶上的全选也应该勾上

```js
<el-checkbox-group v-model="userRole" @change="handleCheckedRoleChange">

const handleCheckedRoleChange = (val:string[]) => {
  const checkCount:number = val.length
  checkAll.value = checkCount === allRole.value.length
  isIndeterminate.value = checkCount > 0 && checkCount < allRole.value.length
}
```

#### 1.5.2 接口逻辑与数据展示

获取用户职位对应的接口：[GET](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/toAssignUsingGET) [/admin/acl/user/toAssign/{adminId}](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/toAssignUsingGET)

- 发请求获取全部的职位，然后把当前用户已有的职位赋值给对应的数组，这样点击进抽屉的时候就会默认勾选上对应的职位了
- 选中的数据收集在userRole数组中，通知服务器修改数据时，把userRole数组带上

```js
const setRole = async (row: User) => {
  drawer1.value = true
  Object.assign(UserParams, row)
  const {id} = row
  let result:any = await reqGetUserRole((id as number))
  if(result.code == 200){
    allRolesList.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
  }
}
```

#### 1.5.3 数据收集

对应接口：[POST](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/doAssignUsingPOST) [/admin/acl/user/doAssignRole](http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/doAssignUsingPOST)

```js
const saveClick = async () =>{
  let data:SetRoleData = {
    userId:(UserParams.id as number),
    roleIdList:userRole.value.map(item => item.id)
  }
  let result:any = await reqSetUserRule(data)
  if(result.code == 200){
    drawer1.value = false
    ElMessage({
      type:'success',
      message:'修改成功'
    })
    getHasUser(pageNo.value)
  }
}
```

