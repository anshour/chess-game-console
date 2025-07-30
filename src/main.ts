import { CliController } from './cli/cli-controller';
import chalk from 'chalk';

function main(): void {
  try {
    const controller = new CliController();
    controller.start();
  } catch (error) {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught exception:'), error);
  process.exit(1);
});

main();
