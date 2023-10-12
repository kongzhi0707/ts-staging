"use strict";
// create 命令需要用到的所有方法
Object.defineProperty(exports, "__esModule", { value: true });
exports.end = exports.installFeature = exports.installDevEnviroment = exports.installTypesNode = exports.installTSAndInit = exports.changePackageInfo = exports.initProjectDir = exports.selectFeature = exports.isFileExist = void 0;
const common_1 = require("./common");
const fs_1 = require("fs");
const inquirer_1 = require("inquirer");
const chalk_1 = require("chalk");
const shell = require("shelljs");
const installFeatureMethod = require("./installFeature");
/**
 * 判断当前目录下是否已经存在指定的文件，如果存在则退出进行
 * @param filename 文件名
 */
function isFileExist(filename) {
    // 获取文件的绝对路径
    const file = (0, common_1.getProjectPath)(filename);
    if ((0, fs_1.existsSync)(file)) {
        (0, common_1.printMsg)((0, chalk_1.red)(`${file} 已经存在`));
        process.exit(1);
    }
}
exports.isFileExist = isFileExist;
/**
 * 交互式命令，让用户自己选择需要的功能
 * return ['ESlint', 'Prettier', 'CZ']
 */
async function selectFeature() {
    // 清空命令行
    (0, common_1.clearConsole)();
    // 输出信息
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (0, common_1.printMsg)((0, chalk_1.blue)(`TS CLI v${require('../../package.json').version}`));
    (0, common_1.printMsg)('Start initializing the project:');
    (0, common_1.printMsg)('');
    const { feature } = await (0, inquirer_1.prompt)([
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
    return feature;
}
exports.selectFeature = selectFeature;
/**
 * 初始化项目的目录
 */
function initProjectDir(projectName) {
    shell.exec(`mkdir ${projectName}`);
    shell.cd(projectName);
    shell.exec('npm init -y');
}
exports.initProjectDir = initProjectDir;
/**
 * 改写项目中 package.json 的 name description
 */
function changePackageInfo(projectName) {
    const packageJSON = (0, common_1.readJsonFile)('./package.json');
    packageJSON.name = packageJSON.description = projectName;
    (0, common_1.writeJsonFile)('./package.json', packageJSON);
}
exports.changePackageInfo = changePackageInfo;
/**
 * 安装 typescript 并初始化
 */
function installTSAndInit() {
    // 安装 typescript 并 执行命令 tsc --init 生成 tsconfig.json文件
    shell.exec('npm i typescript@4.1.2 -D && npx tsc --init');
    // 覆写 tsconfig.json
    const tsconfigJson = {
        compileOnSave: true,
        compilerOptions: {
            target: 'ES2018',
            module: 'commonjs',
            moduleResolution: 'node',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            inlineSourceMap: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            stripInternal: true,
            pretty: true,
            declaration: true,
            outDir: 'lib',
            baseUrl: './',
            paths: {
                // 模块名到基于 baseUrl 的路径映射的列表
                '*': ['src/*'],
            },
        },
        exclude: ['lib', 'node_modules'], // 设置无需进行编译的文件
    };
    (0, common_1.writeJsonFile)('./tsconfig.json', tsconfigJson);
    // 创建 src 目录 和 /src/index.ts
    shell.exec('mkdir src && touch src/index.ts');
}
exports.installTSAndInit = installTSAndInit;
/**
 * 安装 @types/node
 * node.js 的类型定义包
 */
function installTypesNode() {
    shell.exec('npm i @types/node@14.14.10 -D');
}
exports.installTypesNode = installTypesNode;
/**
 * 安装开发环境，支持实时编译
 */
function installDevEnviroment() {
    shell.exec('npm i ts-node-dev@1.0.0 -D');
    /**
     * 在 package.json 的 scripts 中增加如下内容
     * "dev:comment": "启动开发环境",
     * "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
     */
    const packageJson = (0, common_1.readJsonFile)('./package.json');
    packageJson.scripts['dev:comment'] = '启动开发环境';
    packageJson.scripts['dev'] =
        'ts-node-dev --respawn --transpile-only src/index.ts';
    (0, common_1.writeJsonFile)('./package.json', packageJson);
}
exports.installDevEnviroment = installDevEnviroment;
/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
function installFeature(feature) {
    feature.forEach((item) => {
        const func = installFeatureMethod[`install${item}`];
        func();
    });
    // 安装 husky 和 lint-staged
    installHusky(feature);
    // 安装构建工具
    installFeatureMethod.installBuild(feature);
}
exports.installFeature = installFeature;
/**
 * 安装 husky 和 lint-staged, 并根据功能设置相关命令
 * @param feature 用户选择的功能列表
 */
function installHusky(feature) {
    // feature 副本
    const featureBak = JSON.parse(JSON.stringify(feature));
    // 设置 hooks
    const hooks = {};
    // 判断用户是否选择了CZ，有则设置 hooks
    if (featureBak.includes('CZ')) {
        hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS';
    }
    // 设置 lintstaged
    const lintStaged = [];
    if (featureBak.includes('ESLint')) {
        lintStaged.push('eslint');
    }
    if (featureBak.includes('Prettier')) {
        lintStaged.push('prettier');
    }
    installFeatureMethod.installHusky(hooks, lintStaged);
}
// 整个项目安装结束，给用户提示信息
function end(projectName) {
    (0, common_1.printMsg)(`Successfully created project ${(0, chalk_1.yellow)(projectName)}`);
    (0, common_1.printMsg)('Get started with the following commands:');
    (0, common_1.printMsg)('');
    (0, common_1.printMsg)(`${(0, chalk_1.gray)('$')} ${(0, chalk_1.cyan)('cd ' + projectName)}`);
    (0, common_1.printMsg)(`${(0, chalk_1.gray)('$')} ${(0, chalk_1.cyan)('npm run dev')}`);
    (0, common_1.printMsg)('');
}
exports.end = end;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQXFCOzs7QUFFckIscUNBUWtCO0FBQ2xCLDJCQUFnQztBQUNoQyx1Q0FBa0M7QUFDbEMsaUNBQXNEO0FBQ3RELGlDQUFpQztBQUNqQyx5REFBeUQ7QUFFekQ7OztHQUdHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLFFBQWdCO0lBQzFDLFlBQVk7SUFDWixNQUFNLElBQUksR0FBRyxJQUFBLHVCQUFjLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNwQixJQUFBLGlCQUFRLEVBQUMsSUFBQSxXQUFHLEVBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUM7QUFQRCxrQ0FPQztBQUVEOzs7R0FHRztBQUNJLEtBQUssVUFBVSxhQUFhO0lBQ2pDLFFBQVE7SUFDUixJQUFBLHFCQUFZLEdBQUUsQ0FBQztJQUNmLE9BQU87SUFDUCw4REFBOEQ7SUFDOUQsSUFBQSxpQkFBUSxFQUFDLElBQUEsWUFBSSxFQUFDLFdBQVcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25FLElBQUEsaUJBQVEsRUFBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzVDLElBQUEsaUJBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNiLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLElBQUEsaUJBQU0sRUFBQztRQUMvQjtZQUNFLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLDRDQUE0QztZQUNyRCxPQUFPLEVBQUU7Z0JBQ1AsRUFBRSxJQUFJLEVBQUUs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