import { program } from 'commander';
import create from './order/create';

// ts-cli -v 或 ts-cli --version
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
