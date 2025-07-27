import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player } from '../core/player.js';
import { PieceColor, PieceType } from '../utils/enums.js';
import { Position } from '../core/position.js';
import { Move } from '../core/types.js';

export class InputHandler {
  waitForKeyPress(): void {
    readlineSync.question(chalk.gray('\nPress any key to continue...\n'));
  }

  promptForPlayerName(color: PieceColor): string {
    return readlineSync
      .question(chalk.white(`Enter name for ${color} player: `), {
        defaultInput: `${color} Player`,
      })
      .trim();
  }

  promptForPlayerMove(player: Player): Move {
    const prompt = chalk.green(
      `${player.name} (${player.color}), enter your move: `,
    );

    const value = readlineSync.question(prompt).trim();

    return this.parseInputMove(value);
  }

  promptForConfirmation(message: string): boolean {
    return readlineSync.keyInYNStrict(chalk.yellow(message));
  }

  promptForPromotion(): PieceType {
    console.log(chalk.cyan('\n🎉 Pawn Promotion! 🎉'));
    console.log(chalk.yellow('Your pawn has reached the end of the board!'));
    console.log(chalk.white('Choose which piece you want to promote to:'));

    const choices = [
      `${PieceType.QUEEN} - Queen (Most powerful piece)`,
      `${PieceType.ROOK} - Rook (Castle, moves horizontally/vertically)`,
      `${PieceType.BISHOP} - Bishop (Moves diagonally)`,
      `${PieceType.KNIGHT} - Knight (L-shaped moves)`,
    ];

    const selectedIndex = readlineSync.keyInSelect(
      choices,
      chalk.green('Select your promotion piece:'),
      { cancel: false },
    );

    const promotionTypes = [
      PieceType.QUEEN,
      PieceType.ROOK,
      PieceType.BISHOP,
      PieceType.KNIGHT,
    ];
    const selectedType = promotionTypes[selectedIndex];

    return selectedType;
  }

  private parseInputMove(value: string): Move {
    const coordinates = value.includes(' ')
      ? value.split(' ')
      : value.split(',');

    if (coordinates.length !== 2) {
      throw new Error(
        'Invalid move! Please enter moves in format: from to (e.g., "a2 a4", "e2,e4" or "1,4 3,4")',
      );
    }

    return {
      from: Position.parse(coordinates[0]),
      to: Position.parse(coordinates[1]),
    };
  }
}
