import Table from 'cli-table3';
import chalk from 'chalk';
import { GameStatus, PieceColor } from '../utils/enums.js';
import { Board } from './board.js';
import { Position } from './position.js';

export class GameDisplay {
  static displayWelcome(): void {
    console.clear();

    console.log('🏁 Welcome to Console Chess! 🏁');

    console.log(chalk.yellow('\nWelcome to Console Chess!'));
    console.log(chalk.white('\nHow to play:'));
    console.log(
      chalk.gray(
        '• Enter moves in format: from to (e.g., "e2,e4" or "1,4 3,4")',
      ),
    );
    console.log(chalk.gray('• Algebraic format: a1-h8 (e.g., "e2 e4")'));
    console.log(chalk.gray('• Numeric format: row,col (e.g., "1,4 3,4")'));
    console.log(chalk.gray('• Type "quit" or "exit" to end the game'));
    console.log(chalk.gray('• Type "help" for commands'));

    console.log(chalk.green('\nGame starting...'));
  }

  static displayBoard(board: Board): void {
    const table = new Table({
      head: ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      style: {
        head: ['cyan'],
        border: ['white'],
        compact: false,
      },
      colWidths: [3, 4, 4, 4, 4, 4, 4, 4, 4],
    });

    for (let rank = 7; rank >= 0; rank--) {
      const row: string[] = [chalk.cyan.bold((rank + 1).toString())];

      for (let file = 0; file < 8; file++) {
        const position = new Position(rank, file);
        const piece = board.getPieceAt(position);

        if (!piece) {
          const isLightSquare = (rank + file) % 2 === 0;
          row.push(isLightSquare ? chalk.gray('□') : chalk.dim('■'));
          continue;
        }

        const symbol = piece.type;

        if (piece.color === PieceColor.WHITE) {
          row.push(chalk.white.bold(symbol));
        } else {
          row.push(chalk.yellow.bold(symbol));
        }
      }

      table.push(row);
    }

    console.log('\n' + table.toString());
  }

  static displayGameEnd(gameStatus: GameStatus): void {
    console.clear();

    console.log(chalk.cyan('\n=== GAME OVER ==='));

    switch (gameStatus) {
      case GameStatus.WHITE_WINS:
        console.log(chalk.white.bold('🏆 WHITE PLAYER WINS! 🏆'));
        break;
      case GameStatus.BLACK_WINS:
        console.log(chalk.red.bold('🏆 BLACK PLAYER WINS! 🏆'));
        break;
      case GameStatus.DRAW:
        console.log(chalk.yellow.bold('🤝 GAME ENDED IN A DRAW 🤝'));
        break;
    }

    // TODO: Show game statistics: final board state, move history, and captured pieces

    console.log(chalk.green('\nThank you for playing!'));
  }

  static displayHelp(): void {
    const title = chalk.yellow.bold('╔══════════════════════╗');
    const titleText = chalk.yellow.bold('║   CHESS GAME HELP    ║');
    const titleBottom = chalk.yellow.bold('╚══════════════════════╝');

    console.log(`\n${title}`);
    console.log(titleText);
    console.log(titleBottom);

    console.log(chalk.green.bold('\n📝 Input formats:'));
    console.log(
      chalk.white('  • Algebraic: ') +
        chalk.cyan.bold('a2 a4') +
        chalk.white(' or ') +
        chalk.cyan.bold('a2,a4'),
    );
    console.log(
      chalk.white('  • Numeric: ') +
        chalk.cyan.bold('0,1 0,3') +
        chalk.white(' or ') +
        chalk.cyan.bold('0,1,0,3'),
    );

    console.log(chalk.green.bold('\n🎮 Commands:'));
    console.log(
      chalk.white('  • Type ') +
        chalk.magenta.bold('"quit"') +
        chalk.white(' to exit the game'),
    );
    console.log(
      chalk.white('  • Type ') +
        chalk.magenta.bold('"help"') +
        chalk.white(' to show this message'),
    );

    console.log(chalk.green.bold('\n🎯 Legend:'));
    console.log(
      chalk.white('  • ') +
        chalk.white.bold('White pieces') +
        chalk.white(' = White/Light color'),
    );
    console.log(
      chalk.white('  • ') +
        chalk.yellow.bold('Black pieces') +
        chalk.white(' = Yellow color'),
    );
    console.log(
      chalk.white('  • ') +
        chalk.gray('□ ■') +
        chalk.white(' = Empty squares\n'),
    );
  }

  static displayGameInfo(currentPlayer: PieceColor): void {
    console.log(chalk.blue(`\nCurrent Player: ${currentPlayer}`));

    // TODO: Display game status, move history, and captured pieces
  }

  static displayError(message: string): void {
    console.log(chalk.red(`\n❌ Error: ${message}`));
  }
}
