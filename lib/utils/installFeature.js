"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBuild = exports.installHusky = exports.installCZ = exports.installPrettier = exports.installESLint = void 0;
/**
 * 实现各个功能的安装方法
 */
const shell = require("shelljs");
const fs_1 = require("fs");
const common_1 = require("./common");
const chalk_1 = require("chalk");
/**
 * 安装Eslint
 */
function installESLint() {
    shell.exec('npm i eslint @typescript-eslint/parser@4.9.0 @typescript-eslint/eslint-plugin@4.9.0 -D');
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
        (0, fs_1.writeFileSync)('./.eslintrc.js', eslintrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Failed to write .eslintrc.js file content')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in .eslintrc.js')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(eslintrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['eslint:comment'] =
        '使用 ESLint 检查并自动修复 src目录下所有扩展名为 .ts 的文件';
    packageJson.scripts['eslint'] = 'eslint --fix src --ext .ts --max-warnings=0';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installESLint = installESLint;
/**
 * 安装 Prettier
 */
function installPrettier() {
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
        (0, fs_1.writeFileSync)('./.prettierrc.js', prettierrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Failed to write .prettierrc.js file content')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in .prettierrc.js')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(prettierrc)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['prettier:comment'] =
        '自动格式化 src目录下的所有 .ts文件';
    packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installPrettier = installPrettier;
/**
 * 安装 CZ，规范 git 提交信息
 */
function installCZ() {
    shell.exec('npx commitizen init cz-conventional-changelog --save --save-exact');
    shell.exec('npm i @commitlint/cli@11.0.0 @commitlint/config-conventional@11.0.0 -D');
    // 添加 commitlint.config.js
    const commitlint = `module.exports = {
    extends: ['@commitlint/config-conventional']
  }`;
    try {
        (0, fs_1.writeFileSync)('./commitlint.config.js', commitlint, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Failed to write commitlint.config.js file content')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in commitlint.config.js')}`);
        (0, common_1.printMsg)(`${(0, chalk_1.red)(commitlint)}`);
    }
    // 改写 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
    packageJson.scripts['commit'] = 'cz';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installCZ = installCZ;
/**
 * 安装 husky 和 lint-staged, 以实现 git commit 时自动化校验
 * @param hooks 需要自动执行的钩子
 * @param lintStaged 需要钩子运行的命令
 */
function installHusky(hooks, lintStaged) {
    // 1）初始化 git 仓库
    shell.exec('git init');
    // 2）再安装 husky 和 lint-staged
    shell.exec('npm i husky@4.3.0 lint-staged@10.5.2 -D');
    // 3) 设置 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson['husky'] = {
        hooks: {
            'pre-commit': 'lint-staged',
            ...hooks,
        },
    };
    packageJson['lint-staged'] = {
        '*.ts': lintStaged.map((item) => `npm run ${item}`),
    };
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installHusky = installHusky;
/**
 * 安装构建工具
 */
function installBuild(feature) {
    // 设置 package.json
    const packageJson = (0, common_1.readJsonFile)('./package.json');
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
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installBuild = installBuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbEZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW5zdGFsbEZlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxpQ0FBaUM7QUFDakMsMkJBQW1DO0FBQ25DLHFDQUE4RTtBQUM5RSxpQ0FBNEI7QUFFNUI7O0dBRUc7QUFDSCxTQUFnQixhQUFhO0lBQzNCLEtBQUssQ0FBQyxJQUFJLENBQ1Isd0ZBQXdGLENBQ3pGLENBQUM7SUFDRixrQkFBa0I7SUFDbEIsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCZixDQUFDO0lBQ0gsSUFBSTtRQUNGLElBQUEsa0JBQWEsRUFBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNsRTtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsMkNBQTJDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsa0RBQWtELENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBQSxpQkFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsa0JBQWtCO0lBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUEscUJBQVksRUFBYyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hFLFdBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDbkMsd0NBQXdDLENBQUM7SUFDM0MsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyw2Q0FBNkMsQ0FBQztJQUM5RSxJQUFBLHNCQUFhLEVBQWMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQXpDRCxzQ0F5Q0M7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