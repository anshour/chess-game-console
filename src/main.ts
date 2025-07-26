import chalk from 'chalk';
import { GameEngine } from './core/game-engine.js';

function main(): void {
  try {
    const game = new GameEngine();
    game.start();
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
