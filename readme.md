### 搭建 typescript 脚手架工具 ts-cli

#### 一）初始化项目目录

执行命令如下：

```
mkdir ts-staging && cd ts-staging && npm init -y && npm i typescript -D && npx tsc --init
```

如上命令的含义是：在当前目录下创建一个 ts-staging 目录，然后进入 ts-staging 目录执行 npm init -y 初始化目录产生 package.json 文件，之后运行 npm i typescript -D 在开发环境中安装 typescript 包，之后执行 npx tsc --init 生成 tsconfig.json 文件。

```
mkdir src && touch src/index.ts
```

新建 src 目录作为项目的源码目录，并且在 src 目录下创建 index.ts 文件作为项目的入口文件。

#### 设置 tsconfig.json

如果一个项目的根目录下存在 tsconfig.json 文件的话，那就意味着这个项目是 typescript 开发的，tsconfig.json 文件中指定了用户编译项目的根文件和编译选项，使用 tsc --init 生成的 tsconfig.json 文件包含了大量的选项，其中大部分都被注释掉了。一般我们需要包含如下配置内容即可：

```
{
  "compileOnSave": true, // 设置保存文件的时候自动编译，但需要编译器支持
  "compilerOptions": {
    "target": "ES2018", // ECMAScript 目标版本
    "module": "commonjs", // 指定作用模块 commonjs
    "moduleResolution": "node", // 选择模块解析策略
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true, // 为装饰器提供元数据的支持
    "inlineSourceMap": true, // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候，生成一个错误
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "stripInternal": true, // 禁用在JSDoc注释中包含' @internal '的声明。
    "pretty": true,
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "outDir": "lib", // 指定输出目录
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {
      // 模块名到基于 baseUrl 的路径映射的列表
      "*": ["src/*"]
    }
  },
  "exclude": ["lib", "node_modules"] // 设置无需进行编译的文件
}
```

#### 安装 @types/node (node.js 的类型定义包)

```
npm i @types/node -D
```

#### 安装开发环境实时编译

```
npm i ts-node-dev -D
```

在 package.json 的 scripts 中增加如下内容；

```
{
  "scripts": {
    "dev:comment": "启动开发环境",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  }
}
```

现在当我们执行 npm run dev 即可启动开发环境，并且当我们实时修改文件时可实时编译。

#### ESLint

代码质量对于一个系统的可维护性，可迭代性至关重要，在多人协作一个大型项目中，如果没有把控代码质量的工具，每个人一套编码风格的话，以后其他人来维护代码的话，后期维护工作量加大。因此我们需要使用 ESLint 来作为代码的检查工具。

安装 ESLint 命令如下：

```
npx eslint --init
```

如上安装完成后，会在项目的根目录生成一个 .eslintrc.js 文件，接下来在 package.json 的 scripts 中增加如下配置：

```
{
  "scripts": {
    "eslint:comment": "使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts的文件",
    "eslint": "eslint --fix src --ext .ts --max-warnings=0"
  }
}
```

#### Prettier

Prettier 是一个专注于统一代码风格的工具，上面我们提到 ESlint 能够检测我们的代码，为什么我们还需要 Prettier 呢？Eslint其实有两种类型规则：

```
1) 格式规则：比如 key-spacing, comma-spacing 等
2）质量规则：比如 no-var 等
```

格式规则主要是控制代码风格，简单的说就是代码看起来好看，易读。而质量规则主要是发现代码中存在潜在的bug或可能会制到bug的地方。也就是说会从语法层面去考虑。比如
禁止使用var声明变量，而 prettier 则是专注于 格式规则，因此格式化方面我们使用更加专业的 Prettier。

安装Prettier命令如下：

```
npm i prettier -D
```

安装完成后，我们需要在项目的根目录下新增 .prettierrc.js, 配置如下：

```
module.exports = {
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
}
```

然后我们还需要在 package.json 的 scripts 中添加命令如下：

```
{
  "scripts": {
    "prettier:comment": "自动格式化 src 目录下所有的 .ts文件",
    "prettier": "prettier --write \"src/**/*.ts\""
  }
}
```

#### commitizen

在系统开发中，如果git提交说明良好，在后期的维护以及bug处理时会变得有据可查，提高了系统的可维护性，而且还可以根据规范的提交说明快速生成开发日志。从而方便开发者或用户追踪开发信息和功能特性。commitizen 是一个实现规范提交说明的工具。如下图效果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/21.png" /> <br />

我们需要安装如下包，安装命令如下：

```
npx commitizen init cz-conventional-changelog --save --save-exact
```

安装时主要做了三件事：

```
1）在项目中安装 cz-conventional-changelog 适配器依赖。
2）将适配器依赖保存到 package.json 的 devDependencies 对象中。
3）在 package.json 中新增 config.commitizen 字段，主要用于配置 cz 工具的适配器路径。
```

内容如下：

```
{
  "devDependencies": {
    "cz-conventional-changelog": "^3.3.0"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

接下来安装校验工具，负责校验提交信息是否符合规范。

```
npm i @commitlint/cli @commitlint/config-conventional -D
```

在项目的根目录下 新建 commitlint.config.js 并设置校验规则

```
// eslint-disable-next-line no-undef
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

然后 在 package.json 的 scripts 中增加以下内容。

```
{
  "scripts": {
    "commit:comment": "引导设置规范化的提交信息",
    "commit": "cz"
  }
}
```

现在，我们就可以使用规范化的提交信息了，我们可以在 git add . 之后执行 npm run commit 来代替 git commit ， 会弹出一个列表，会引导我们一步步的填充符合规范的提交信息。当我们熟悉以后可以使用 git commit 来进行提交信息。

#### husky@4 和 lint-staged

#### 注意：到现在为止，如果我们的项目还没有执行过 git init，即项目没有被 git 管理，就一定要先执行 git init, 然后在安装 husky。 否则后面还是需要重新安装一遍。

安装命令如下：

```
npm i husky@4 lint-staged -D
```

然后我们在 package.json 中添加如下内容

```
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.ts": ["npm run eslint", "npm run prettier"]
  }
}
```

之前我们在 package.json 中的scripts设置的ESLint, Prettier, 以及 commitizen, 到目前为止都只限于开发者手动执行 npm run xxx 才能生效，这样的话一点都不智能，并且玩意开发者忘记了执行命令该咋办呢？

因此这个时候 husky 和 lint-staged 出来了，上面的配置的原理就是监听了 git hook 脚本的执行，在特定的命令执行前(pre-commit) 执行相应的命令 (lint-staged).

#### husky v5 版本的使用方式

下面的是 husky@5 的使用方式。

#### 安装husky@5

```
npm i husky -D
```

使用 git hooks

```
npx husky install
```

执行完上面的命令后，会在项目的根目录生成一个 .husky的文件夹。

##### 添加hooks

```
npx husky add ./husky/pre-commit "npm test"
```

会在 .husky 目录下生成一个 pre-commit 脚本文件。

现在我们使用 git commit -m 'message' 就会看到hook生效了。

#### 构建

在package.json 中添加如下内容：

```
{
  "scripts": {
    "build:comment": "构建",
    "build": "npm run eslint && npm run prettier && rm -rf lib && tsc --build"
  }
}
```

我们使用命令 npm run build， 就会在项目的根目录下生成 lib 文件。

#### 封装成脚手架

现在我们将上面整个搭建过程封装成一个脚手架，脚手架的开发就在上面搭建的项目中进行。

#### 准备工作 --- 常用的工具包

开发一个脚手架，一般都需要一些工具包的支持。项目中使用到了以下工具包。

```
1）commander （完整的node.js命令行解决方案）
2）chalk (给我们的终端文字添加样式) 3) shelljs (让我们在node.js中使用shell命令)
4）inquirer (通过交互式命令用户界面，收集用户的选择)
5）clear-console (清空命令行的当前界面，类似于浏览器控制台的clear(）)
6）ora (进一步丰富命令行，支持添加一些图标，动效)。
7）download-git-repo (让我们可以使用node.js从git仓库下载代码)
```
