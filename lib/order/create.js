"use strict";
// create 命令的具体任务
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("../utils/create");
// create 命令
async function create(projectName) {
    // 1）判断文件是否已经存在
    (0, create_1.isFileExist)(projectName);
    // 2）选择需要的功能
    const feature = await (0, create_1.selectFeature)();
    // 3）初始化项目目录
    (0, create_1.initProjectDir)(projectName);
    // 4）改写项目的 package.json 基本信息，比如 name/description
    (0, create_1.changePackageInfo)(projectName);
    // 5) 安装typescript 并初始化
    (0, create_1.installTSAndInit)();
    // 6) 安装 @types/node
    (0, create_1.installTypesNode)();
    // 7) 安装开发环境，支持实时编译
    (0, create_1.installDevEnviroment)();
    // 8) 安装feature
    (0, create_1.installFeature)(feature);
    // 9) 结束
    (0, create_1.end)(projectName);
}
exports.default = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29yZGVyL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCOztBQUVqQiw0Q0FVeUI7QUFFekIsWUFBWTtBQUNHLEtBQUssVUFBVSxNQUFNLENBQUMsV0FBbUI7SUFDdEQsZUFBZTtJQUNmLElBQUEsb0JBQVcsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixZQUFZO0lBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLHNCQUFhLEdBQUUsQ0FBQztJQUN0QyxZQUFZO0lBQ1osSUFBQSx1QkFBYyxFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVCLGdEQUFnRDtJQUNoRCxJQUFBLDBCQUFpQixFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLHVCQUF1QjtJQUN2QixJQUFBLHlCQUFnQixHQUFFLENBQUM7SUFDbkIsb0JBQW9CO0lBQ3BCLElBQUEseUJBQWdCLEdBQUUsQ0FBQztJQUNuQixtQkFBbUI7SUFDbkIsSUFBQSw2QkFBb0IsR0FBRSxDQUFDO0lBQ3ZCLGVBQWU7SUFDZixJQUFBLHVCQUFjLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEIsUUFBUTtJQUNSLElBQUEsWUFBRyxFQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFuQkQseUJBbUJDIn0=