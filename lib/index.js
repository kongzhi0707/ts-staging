"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./order/create");
// ts-cli -v 或 ts-cli --version
commander_1.program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(`${require('../package.json').version}`, '-v --version')
    .usage('<command> [options]');
commander_1.program
    .command('create <app-name>')
    .description('Create new project from => ts-cli create yourProjectName')
    .action(async (name) => {
    // 创建命令具体做的事情都在这里，name 是我们指定的 newPro
    await (0, create_1.default)(name);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBb0M7QUFDcEMsMkNBQW9DO0FBRXBDLCtCQUErQjtBQUMvQixtQkFBTztJQUNMLDhEQUE4RDtLQUM3RCxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxjQUFjLENBQUM7S0FDaEUsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFFaEMsbUJBQU87S0FDSixPQUFPLENBQUMsbUJBQW1CLENBQUM7S0FDNUIsV0FBVyxDQUFDLDBEQUEwRCxDQUFDO0tBQ3ZFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBWSxFQUFFLEVBQUU7SUFDN0Isb0NBQW9DO0lBQ3BDLE1BQU0sSUFBQSxnQkFBTSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBRUwsbUJBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDIn0=