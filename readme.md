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

安装对应的包如下：

```
npm i commander chalk shelljs inquirer clear-console -S
```

#### 本地调试

在项目的根目录下的 package.json 中增加如下内容：

```
{
  "bin": {
    "ts-cli": "./bin/ts-cli.js"
  }
}
```

bin 表示命令 (ts-cli) 的可执行文件的位置，然后我们在项目的根目录下执行 npm link, 就会将 package.json 中的 bin 的值路径添加全局链接，在命令中执行 ts-cli 就会执行 ./bin/ts-cli.js 的文件。

当用户安装带有bin字段的包时，如果是全局安装的话，npm 就会使用符号链接把这些文件链接到 /usr/local/node_modules/.bin/中(全局下)。如果是本地安装的话，会链接到 ./node_modules/.bin/.

现在我们在项目的根目录下新增 bin 目录，然后在 bin 目录下新建 ts-cli.js文件，内容添加如下：

```
#!/usr/bin/env node

// 将构建目录lib下的 index.js 作为脚手架的入口
require('../lib/index');
```

#### 搭建目录结构如下：

下面是源码的目录结构如下：

```
|--- src
| |--- order                  # 命令目录，一个文件对应一个命令
| | |--- create.ts
| |--- utils                  # 工具方法目录，分为命令专用方法和通用方法
| | |--- common.ts
| | |--- create.ts
| | |--- installFeature.ts
| |--- index.ts               # 源码入口
```

当我们运行 ts-staging-cli 命令后，会找到 目录下 /bin/ts.cli.js 文件。

```
"bin": {
  "ts-staging-cli": "./bin/ts-cli.js"
},
```

./bin/ts.cli.js 入口代码如下：

```
#!/usr/bin/env node

// 将构建目录(lib)下的 index.js 作为脚手架的入口
require('../lib/index')
```

因此会找到 src/index.ts 作为入口文件，因为该文件通过打包构建到 lib/index.js 目录下的。

src/index.ts 代码如下：

```
import { program } from 'commander';
import create from './order/create';

// ts-staging-cli -v 或 ts-staging-cli --version
program
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('Create new project from => ts-cli create yourProjectName')
  .action(async (name: string) => {
    // 创建命令具体做的事情都在这里，name 是我们指定的 newPro
    await create(name);
  });

program.parse(process.argv);
```

如上代码，我们可以通过 ts-staging-cli -v 或 ts-staging-cli --version 查看版本号，会读取 package.json 中的版本号。

我们可以命令 创建我们的脚手架，比如 ts-staging-cli create testApp. 就会在我们的对应的目录下 生成 脚手架目录文件。
会调用 src/order/create.ts 文件。该文件代码如下：

src/order/create.ts 代码：

```
// create 命令的具体任务

import {
  changePackageInfo,
  end,
  initProjectDir,
  installDevEnviroment,
  installFeature,
  installTSAndInit,
  installTypesNode,
  isFileExist,
  selectFeature,
} from '../utils/create';

// create 命令
export default async function create(projectName: string): Promise<void> {
  // 1）判断文件是否已经存在
  isFileExist(projectName);
  // 2）选择需要的功能
  const feature = await selectFeature();
  // 3）初始化项目目录
  initProjectDir(projectName);
  // 4）改写项目的 package.json 基本信息，比如 name/description
  changePackageInfo(projectName);
  // 5) 安装typescript 并初始化
  installTSAndInit();
  // 6) 安装 @types/node
  installTypesNode();
  // 7) 安装开发环境，支持实时编译
  installDevEnviroment();
  // 8) 安装feature
  installFeature(feature);
  // 9) 结束
  end(projectName);
}
```

上面代码做了如下事情：

```
1）判断该项目脚手架名是否存在，如果存在，则退出程序。否则执行第二步。
2）选择需要的环境功能，包括 ESLint, Prettier, CZ. 我们可以选择所有的功能。
3) 初始化项目目录，创建 项目名称为 testApp, 然后进入该目录， 使用 shell.exec 执行命令 npm init -y，初始化 package.json文件生成。
4）改写项目的 package.json 基本信息，比如 name/description。
5）安装typescript 并初始化，先执行命令：shell.exec('npm i typescript@4.1.2 -D && npx tsc --init'); 安装对应的依赖包，然后把 tsconfig.json 文件的配置项 写入到 项目的根目录的 tsconfig.json 文件内。最后 在项目的根目录下 创建 src/index.ts 目录及文件。
6）安装 @types/node，执行命令 shell.exec('npm i @types/node@14.14.10 -D');
7）安装开发环境，支持实时编译，安装依赖包：shell.exec('npm i ts-node-dev@1.0.0 -D'); 在 package.json 的 scripts 中增加打包命令。
8）安装前面用户选择的功能，比如选择了所有的 ESLint，Prettier, CZ，安装 ESLint，Prettier, CZ，并且配置项写入到 .eslintrc.js, .prettier.js 及 commitlint.config.js 文件中。
9）整个项目安装结束，给用户提示信息。
```

src/utils/create.ts 代码如下：

// create 命令需要用到的所有方法

```
import {
  getProjectPath, // 获取项目的绝对路径
  PackageJSON,
  JSON,
  printMsg, // 打印信息
  readJsonFile, // 读取指定路径下json文件
  writeJsonFile, // 覆写指定路径下的json文件
  clearConsole, // 清空命令行
} from './common';
import { existsSync } from 'fs';
import { prompt } from 'inquirer';
import { blue, cyan, gray, red, yellow } from 'chalk';
import * as shell from 'shelljs';
import * as installFeatureMethod from './installFeature';

/**
 * 判断当前目录下是否已经存在指定的文件，如果存在则退出进行
 * @param filename 文件名
 */
export function isFileExist(filename: string): void {
  // 获取文件的绝对路径
  const file = getProjectPath(filename);
  if (existsSync(file)) {
    printMsg(red(`${file} 已经存在`));
    process.exit(1);
  }
}

/**
 * 交互式命令，让用户自己选择需要的功能
 * return ['ESlint', 'Prettier', 'CZ']
 */
export async function selectFeature(): Promise<Array<string>> {
  // 清空命令行
  clearConsole();
  // 输出信息
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  printMsg(blue(`TS CLI v${require('../../package.json').version}`));
  printMsg('Start initializing the project:');
  printMsg('');
  const { feature } = await prompt([
    {
      name: 'feature',
      type: 'checkbox',
      message: 'Check the features needed for your project',
      choices: [
        { name: 'ESLint', value: 'ESLint' },
        { name: 'Prettier', value: 'Prettier' },
        { name: 'CZ', value: 'CZ' },
      ],
    },
  ]);
  return feature as Array<string>;
}

/**
 * 初始化项目的目录
 */
export function initProjectDir(projectName: string): void {
  shell.exec(`mkdir ${projectName}`);
  shell.cd(projectName);
  shell.exec('npm init -y');
}

/**
 * 改写项目中 package.json 的 name description
 */
export function changePackageInfo(projectName: string): void {
  const packageJSON: PackageJSON = readJsonFile<PackageJSON>('./package.json');
  packageJSON.name = packageJSON.description = projectName;
  writeJsonFile<PackageJSON>('./package.json', packageJSON);
}

/**
 * 安装 typescript 并初始化
 */
export function installTSAndInit(): void {
  // 安装 typescript 并 执行命令 tsc --init 生成 tsconfig.json文件
  shell.exec('npm i typescript@4.1.2 -D && npx tsc --init');
  // 覆写 tsconfig.json
  const tsconfigJson: JSON = {
    compileOnSave: true, // 设置保存文件的时候自动编译，但需要编译器支持
    compilerOptions: {
      target: 'ES2018', // ECMAScript 目标版本
      module: 'commonjs', // 指定作用模块 commonjs
      moduleResolution: 'node', // 选择模块解析策略
      experimentalDecorators: true, // 启用装饰器
      emitDecoratorMetadata: true, // 为装饰器提供元数据的支持
      inlineSourceMap: true, // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
      noImplicitThis: true, // 当 this 表达式值为 any 类型的时候，生成一个错误
      noUnusedLocals: true, // 有未使用的变量时，抛出错误
      stripInternal: true, // 禁用在JSDoc注释中包含' @internal '的声明。
      pretty: true,
      declaration: true, // 生成相应的 '.d.ts' 文件
      outDir: 'lib', // 指定输出目录
      baseUrl: './', // 用于解析非相对模块名称的基目录
      paths: {
        // 模块名到基于 baseUrl 的路径映射的列表
        '*': ['src/*'],
      },
    },
    exclude: ['lib', 'node_modules'], // 设置无需进行编译的文件
  };
  writeJsonFile<JSON>('./tsconfig.json', tsconfigJson);
  // 创建 src 目录 和 /src/index.ts
  shell.exec('mkdir src && touch src/index.ts');
}

/**
 * 安装 @types/node
 * node.js 的类型定义包
 */
export function installTypesNode(): void {
  shell.exec('npm i @types/node@14.14.10 -D');
}

/**
 * 安装开发环境，支持实时编译
 */
export function installDevEnviroment(): void {
  shell.exec('npm i ts-node-dev@1.0.0 -D');
  /**
   * 在 package.json 的 scripts 中增加如下内容
   * "dev:comment": "启动开发环境",
   * "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
   */
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['dev:comment'] = '启动开发环境';
  packageJson.scripts['dev'] =
    'ts-node-dev --respawn --transpile-only src/index.ts';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
export function installFeature(feature: Array<string>): void {
  feature.forEach((item) => {
    const func = installFeatureMethod[
      `install${item}`
    ] as unknown as () => void;
    func();
  });
  // 安装 husky 和 lint-staged
  installHusky(feature);
  // 安装构建工具
  installFeatureMethod.installBuild(feature);
}

/**
 * 安装 husky 和 lint-staged, 并根据功能设置相关命令
 * @param feature 用户选择的功能列表
 */
function installHusky(feature: Array<string>): void {
  // feature 副本
  const featureBak = JSON.parse(JSON.stringify(feature));

  // 设置 hooks
  const hooks = {};
  // 判断用户是否选择了CZ，有则设置 hooks
  if (featureBak.includes('CZ')) {
    hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS';
  }

  // 设置 lintstaged
  const lintStaged: Array<string> = [];
  if (featureBak.includes('ESLint')) {
    lintStaged.push('eslint');
  }
  if (featureBak.includes('Prettier')) {
    lintStaged.push('prettier');
  }
  installFeatureMethod.installHusky(hooks, lintStaged);
}

// 整个项目安装结束，给用户提示信息
export function end(projectName: string): void {
  printMsg(`Successfully created project ${yellow(projectName)}`);
  printMsg('Get started with the following commands:');
  printMsg('');
  printMsg(`${gray('$')} ${cyan('cd ' + projectName)}`);
  printMsg(`${gray('$')} ${cyan('npm run dev')}`);
  printMsg('');
}
```

src/utils/common.ts 是放一些通用的工具方法
代码如下：

```
// 放一些通用的工具方法

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import * as clear from 'clear-console';

export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  scripts: {
    [key: string]: string;
  };
}

export interface JSON {
  [key: string]: unknown;
}

/**
 * 读取指定路径下的json文件
 * @param filename json 文件的路径
 */
export function readJsonFile<T>(filename: string): T {
  return JSON.parse(readFileSync(filename, { encoding: 'utf-8', flag: 'r' }));
}

/**
 * 覆写指定路径下的json文件
 * @param filename json文件的路径
 * @param content json 内容
 */
export function writeJsonFile<T>(filename: string, content: T): void {
  writeFileSync(filename, JSON.stringify(content, null, 2));
}

/**
 * 获取项目的绝对路径
 * @param projectName 项目名
 */
export function getProjectPath(projectName: string): string {
  return resolve(process.cwd(), projectName);
}

/**
 * 打印信息
 * @param msg 信息
 */
export function printMsg(msg: string): void {
  console.log('--打印信息为:---', msg);
}

/**
 * 清空命令行
 */
export function clearConsole(): void {
  clear();
}
```

src/utils/installFeature.ts 文件负责安装 Eslint，prettier，CZ 规范代码的配置文件。代码如下：

```
/**
 * 实现各个功能的安装方法
 */
import * as shell from 'shelljs';
import { writeFileSync } from 'fs';
import { PackageJSON, printMsg, readJsonFile, writeJsonFile } from './common';
import { red } from 'chalk';

/**
 * 安装Eslint
 */
export function installESLint(): void {
  shell.exec(
    'npm i eslint @typescript-eslint/parser@4.9.0 @typescript-eslint/eslint-plugin@4.9.0 -D',
  );
  // 添加 .eslintrc.js
  const eslintrc = `module.exports = {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint",
      "react"
    ],
    "rules": {},
  }`;
  try {
    writeFileSync('./.eslintrc.js', eslintrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .eslintrc.js file content')}`);
    printMsg(`${red('Please add the following content in .eslintrc.js')}`);
    printMsg(`${red(eslintrc)}`);
  }

  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['eslint:comment'] =
    '使用 ESLint 检查并自动修复 src目录下所有扩展名为 .ts 的文件';
  packageJson.scripts['eslint'] = 'eslint --fix src --ext .ts --max-warnings=0';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 Prettier
 */
export function installPrettier(): void {
  shell.exec('npm i prettier@2.2.1 -D');
  // 添加 .prettierrc.js
  const prettierrc = `module.exports = {
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
  }`;
  try {
    writeFileSync('./.prettierrc.js', prettierrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .prettierrc.js file content')}`);
    printMsg(`${red('Please add the following content in .prettierrc.js')}`);
    printMsg(`${red(prettierrc)}`);
  }

  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['prettier:comment'] =
    '自动格式化 src目录下的所有 .ts文件';
  packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 CZ，规范 git 提交信息
 */
export function installCZ(): void {
  shell.exec(
    'npx commitizen init cz-conventional-changelog --save --save-exact',
  );
  shell.exec('npm i @commitlint/cli@11.0.0 @commitlint/config-conventional@11.0.0 -D');
  // 添加 commitlint.config.js
  const commitlint = `module.exports = {
    extends: ['@commitlint/config-conventional']
  }`;
  try {
    writeFileSync('./commitlint.config.js', commitlint, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write commitlint.config.js file content')}`);
    printMsg(
      `${red('Please add the following content in commitlint.config.js')}`,
    );
    printMsg(`${red(commitlint)}`);
  }
  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
  packageJson.scripts['commit'] = 'cz';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 husky 和 lint-staged, 以实现 git commit 时自动化校验
 * @param hooks 需要自动执行的钩子
 * @param lintStaged 需要钩子运行的命令
 */
export function installHusky(
  hooks: { [key: string]: string },
  lintStaged: Array<string>,
): void {
  // 1）初始化 git 仓库
  shell.exec('git init');
  // 2）再安装 husky 和 lint-staged
  shell.exec('npm i husky@4.3.0 lint-staged@10.5.2 -D');
  // 3) 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson['husky'] = {
    hooks: {
      'pre-commit': 'lint-staged',
      ...hooks,
    },
  };
  packageJson['lint-staged'] = {
    '*.ts': lintStaged.map((item) => `npm run ${item}`),
  };
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装构建工具
 */
export function installBuild(feature: Array<string>): void {
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['build:comment'] = '构建';
  let order = '';
  if (feature.includes('ESLint')) {
    order += 'npm run eslint';
  }
  if (feature.includes('Prettier')) {
    order += ' && npm run prettier';
  }
  order += ' && rm -rf lib && tsc --build';
  packageJson.scripts['build'] = order;
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}
```

#### 构建

执行 npm run build 进行构建，构建时会进行代码质量和风格的检查，如果有问题的话，会在控制台打印出来，然后需要手动修复下。然后重新构建。构建完成以后，我们
可以测试下我们的 脚手架命令，执行 ts-staging-cli -v 或 ts-staging-cli --version 查看脚手架的版本。我们也可以执行 ts-staging-cli create testApp 可以创建一个名为 testApp的typescript的项目。

#### 发布到npm

1）修改 package.json 中的内容，如下：

```
{
  "name": "ts-staging-cli",
  "version": "1.0.0",
  "description": "typescript脚手架",
  "keywords": ["typescript", "cli", "typescript 脚手架", "ts脚手架", "ts-staging-cli", "脚手架"],
  "author": "tugenhua",
  "main": "./lib/index.js",
  "files": ["package.json", "README.md", "lib"],
  "repository": {
    "type": "git",
    "url": "https://github.com/kongzhi0707/ts-staging.git"
  },
}
```

```
name: 包名。
main: 表示包的入口文件。
keywords: 关键字，方便别人搜索到我们的包。
files: 告诉npm, publish 时发布哪些包到 npm 仓库。
repository: 项目仓库
version: 包的版本号
author： 作者/开发者的名字
```

#### 发布

在项目的根目录下增加一个发布脚本 publish.sh, 内容如下：

```
#!/bin/bash

echo '开始构建脚手架...'

npm run build

echo '脚手架构建完成，现在发布...'

npm publish --access public
```

在项目的根目录下登录npm，如下命令

```
npm login
```

登录成功后，执行如下命令完成发布：

```
sh publish.sh
```
