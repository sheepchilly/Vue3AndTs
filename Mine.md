# 1.项目配置

## 1.浏览器自动打开

1.浏览器自动打开 - 只需要在 package.json 的 scripts 中添加--open

```js
"scripts": {
    "dev": "vite --open",
  },
```

## 2.eslint 配置

- 什么是 eslint？ --提供一个插件化的 js 代码检测工具

  1.首先安装 eslint

```js
npm i eslint -D
```

2.生成配置文件：eslint.cjs (相当于 eslint 的说明书)

```js
npx eslint --init
```

```js
//.eslint.cjs配置文件
module.exports = {
  //运行环境
  env: {
    browser: true, //浏览器端
    es2021: true, //es2021
  },
  //规则继承
  extends: [
    //全部规则默认是关闭的,这个配置项开启推荐规则,推荐规则参照文档
    //比如:函数不能重名、对象不能出现重复key
    'eslint:recommended',
    //vue3语法规则
    'plugin:vue/vue3-essential',
    //ts语法规则
    'plugin:@typescript-eslint/recommended',
  ],
  //要为特定类型的文件指定处理器
  overrides: [],
  //指定解析器:解析器
  //Esprima 默认解析器
  //Babel-ESLint babel解析器
  //@typescript-eslint/parser ts解析器
  parser: '@typescript-eslint/parser',
  //指定解析器选项
  parserOptions: {
    ecmaVersion: 'latest', //校验ECMA最新版本
    sourceType: 'module', //设置为"script"（默认），或者"module"代码在ECMAScript模块中
  },
  //ESLint支持使用第三方插件。在使用插件之前，您必须使用npm安装它
  //该eslint-plugin-前缀可以从插件名称被省略
  plugins: ['vue', '@typescript-eslint'],
  //eslint规则
  rules: {},
}
```

3.Vue3 环境代码校验插件

安装指令

```js
npm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser
```

直接替换原本的.eslintc.cjs 文件

```js
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

4.新建.eslintignore 忽略校验文件

```js
dist
node_modules
```

5.运行脚本

package.jso 新增两个运行脚本

```js
"scripts": {
    "lint": "eslint src",
    "fix": "eslint src --fix",
}
```

## 3.配置 prettier

- 什么是 prettier？prettier 属于格式化工具，它看不惯格式不统一，所以它就把 eslint 没干好的事接着干。**总结：**eslint 和 prettier 一个保证代码质量，一个保证代码美观

  1.安装 prettier

```js
npm install -D eslint-plugin-prettier prettier eslint-config-prettier
```

2.新建 prettier.json 文件，并添加规则（具体规则需要查看文档）

```js
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

3.prettierignore 忽略配置文件

```js
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

4.**使用：**通过**npm run lint**去检测语法，如果出现不规范格式，通过**npm run fix**去修改

## 4.配置 stylelint

- 什么是 stylelint？--stylelint 为 css 的 lint 工具，可格式化 css 代码，检查 css 语法错误与不合理的写法，指定 cs 书写顺序等

  1.安装以下依赖

```js
npm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D --force
```

2..stylelintrc.cjs 配置文件

```js
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

3..stylelintignore 忽略文件

```
/node_modules/*
/dist/*
/html/*
/public/*
```

4.在 package.json 中添加运行脚本

```js
"scripts": {
	"format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
}
```

5.当我们运行 npm format 的时候，会把代码直接格式化

## 5.配置husky

- 什么是husky？husky在代码提交之前触发git hook(git在客户端的钩子)，然后执行npm run format来自动格式化代码
- 也就是在往git提交代码前先进行格式化

1.安装husky

```js
npm install -D husky --force
```

2.执行

```js
npx husky-init
```

会在根目录下生成个一个.husky 目录，在这个目录下面会有一个 pre-commit 文件，这个文件里面的命令在我们执行 commit 的时候就会执行

在`.husky/pre-commit`文件添加如下命令：

```js
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run format
```

当我们对代码进行 commit 操作的时候，就会执行命令，对代码进行格式化，然后再提交。