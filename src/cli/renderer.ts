import { GameStatus, PieceColor } from '../utils/enums.js';
import { Position } from '../core/position.js';
import { Player } from '../core/player.js';
import { Board } from '../core/board.js';
import { Move } from '../core/types.js';
import CliTable3 from 'cli-table3';
import chalk from 'chalk';

export class Renderer {
  clear(): void {
    console.clear();
  }

  showBoard(board: Board): void {
    const table = new CliTable3({
      head: ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''],
      style: {
        head: ['cyan'],
        border: ['white'],
        compact: false,
      },
      colWidths: [3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
    });

    for (let rank = 7; rank >= 0; rank--) {
      const row: string[] = [chalk.cyan.bold((rank + 1).toString())];

      for (let file = 0; file <= 7; file++) {
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

      row.push(chalk.cyan.bold((rank + 1).toString()));

      table.push(row);
    }

    table.push([
      '',
      chalk.cyan.bold('a'),
      chalk.cyan.bold('b'),
      chalk.cyan.bold('c'),
      chalk.cyan.bold('d'),
      chalk.cyan.bold('e'),
      chalk.cyan.bold('f'),
      chalk.cyan.bold('g'),
      chalk.cyan.bold('h'),
      '',
    ]);

    console.log('\n' + table.toString());
  }

  showTitle(value: string): void {
    const minWidth = 24;
    const padding = 4;
    const borderWidth = 2;
    const contentWidth = Math.max(
      value.length + padding,
      minWidth - borderWidth,
    );

    const horizontalBorder = '═'.repeat(contentWidth);
    const borderTop = chalk.yellow.bold(`╔${horizontalBorder}╗`);
    const borderBottom = chalk.yellow.bold(`╚${horizontalBorder}╝`);

    const availableSpace = contentWidth - value.length;
    const leftPadding = Math.floor(availableSpace / 2);
    const rightPadding = availableSpace - leftPadding;
    const centeredText =
      ' '.repeat(leftPadding) + value + ' '.repeat(rightPadding);
    const titleText = chalk.yellow.bold(`║${centeredText}║`);

    console.log(`\n`);
    console.log(`${borderTop}`);
    console.log(titleText);
    console.log(`${borderBottom}`);
    console.log(`\n`);
  }

  showMessage(message: string): void {
    console.log(chalk.cyan(message));
  }

  showError(message: string): void {
    console.log(chalk.red(`\n❌ Error: ${message}`));
  }

  showWelcome(): void {
    console.clear();

    this.showTitle('Welcome to Console Chess!');

    console.log(chalk.white('How to play:'));
    console.log(chalk.gray('• Enter moves in format: from to'));
    console.log(
      chalk.gray('• Algebraic format: a1-h8 (e.g., "e2 e4", "e2,e4")'),
    );
    console.log(chalk.gray('• Numeric format: row,col (e.g., "1,4 3,4")'));
  }

  showGameEnd(gameStatus: GameStatus): void {
    console.clear();

    this.showTitle('Game Over');

    switch (gameStatus) {
      case GameStatus.WHITE_WINS:
        console.log(chalk.white.bold('🏆 WHITE PLAYER WINS! 🏆'));
        break;
      case GameStatus.BLACK_WINS:
        console.log(chalk.red.bold('🏆 BLACK PLAYER WINS! 🏆'));
        break;
    }

    console.log(chalk.green('\nThank you for playing!\n'));
  }

  showGameInfo(
    currentPlayer: Player,
    capturedPieces: { white: string[]; black: string[] },
  ): void {
    console.log(chalk.blue(`\nCurrent Player: ${currentPlayer.name}`));

    if (capturedPieces.white.length > 0 || capturedPieces.black.length > 0) {
      console.log(chalk.magenta('\nCaptured Pieces:'));

      if (capturedPieces.black.length > 0) {
        console.log(
          chalk.white(`  White captured: ${capturedPieces.black.join(' ')}`),
        );
      }

      if (capturedPieces.white.length > 0) {
        console.log(
          chalk.yellow(`  Black captured: ${capturedPieces.white.join(' ')}`),
        );
      }
    }

    console.log('');
  }

  showInvalidCoordinate(): void {
    console.log(
      chalk.red(
        '\n❌ Invalid move! Please enter moves in format: from to (e.g., "e2,e4" or "1,4 3,4")',
      ),
    );
  }

  showInvalidMove(): void {
    console.log(chalk.red('\n❌ Invalid move! Please try again.'));
  }

  showPieceNotFound(): void {
    console.log(chalk.red('\n❌ No piece found at the selected position!'));
  }

  showInvalidTurn(): void {
    console.log(
      chalk.red('\n❌ Invalid turn! You can only move your own pieces!'),
    );
  }

  showSuccessMove(player: Player, from: Position, to: Position): void {
    console.log(
      chalk.green(
        `\n${player.name} moved from ${from.toAlgebraic()} to ${to.toAlgebraic()}`,
      ),
    );
  }

  showMoveHistory(moveHistory: Move[]): void {
    console.clear();

    this.showTitle('Move History');

    if (moveHistory.length === 0) {
      console.log(chalk.gray('\nNo moves have been made yet.'));
      return;
    }

    console.log(chalk.green.bold('\n📝 Game Moves:\n'));

    // Create a table for move history
    const table = new CliTable3({
      head: ['Move', 'White', 'Black'],
      style: {
        head: ['cyan'],
        border: ['white'],
        compact: false,
      },
      colWidths: [6, 15, 15],
    });

    // Process moves in pairs (white and black)
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = moveHistory[i + 1];

      const whiteNotation = whiteMove
        ? `${whiteMove.from.toAlgebraic()},${whiteMove.to.toAlgebraic()}`
        : '';
      const blackNotation = blackMove
        ? `${blackMove.from.toAlgebraic()},${blackMove.to.toAlgebraic()}`
        : '';

      table.push([
        chalk.cyan.bold(moveNumber.toString()),
        chalk.white(whiteNotation),
        chalk.yellow(blackNotation),
      ]);
    }

    console.log(table.toString());
    console.log(chalk.gray(`\nTotal moves: ${moveHistory.length}`));
  }

  showPawnPromoted(currentPlayer: Player, promotionType: string): void {
    console.log(
      chalk.green(
        `\n🎊 ${currentPlayer.name}'s pawn has been promoted to ${promotionType}! 🎊`,
      ),
    );
  }
}
