// create 命令需要用到的所有方法

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
