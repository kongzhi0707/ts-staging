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
