import chalk from 'chalk';
import { Board } from './board.js';
import { GameStatus, PieceColor } from '../utils/enums.js';
import readlineSync from 'readline-sync';
import { GameDisplay } from './game-display.js';
import { Position } from './position.js';

export class GameEngine {
  private board: Board;
  // TODO: ADD PLAYER NAME
  private currentPlayer: PieceColor;
  private gameStatus: GameStatus;

  // TODO: ADD MOVE HISTORY
  // private moveHistory: Move[];

  // TODO: ADD REPLAY FUNCTIONALITY

  constructor() {
    this.board = new Board();
    this.currentPlayer = PieceColor.WHITE;
    this.gameStatus = GameStatus.PLAYING;
  }

  public start(): void {
    GameDisplay.displayWelcome();
    this.gameLoop();
  }

  private gameLoop(): void {
    while (this.gameStatus === GameStatus.PLAYING) {
      try {
        GameDisplay.displayBoard(this.board);
        GameDisplay.displayGameInfo(this.currentPlayer);

        const input = this.getPlayerInput();
        if (this.isGameCommand(input)) {
          if (!this.handleGameCommand(input)) {
            break; // Exit game
          }
          continue;
        }
        const valid = this.processMove(input);
        if (!valid) {
          continue;
        }
        this.switchPlayer();
      } catch (error) {
        GameDisplay.displayError(
          error instanceof Error ? error.message : 'Unknown error occurred',
        );
        this.waitForKeyPress();
      }
    }
    GameDisplay.displayGameEnd(this.gameStatus);
  }

  private getPlayerInput(): string {
    const prompt = chalk.green(`${this.currentPlayer}, enter your move: `);
    return readlineSync.question(prompt).trim();
  }

  private isGameCommand(input: string): boolean {
    const commands = ['quit', 'exit', 'help', 'history', 'status'];
    return commands.includes(input.toLowerCase());
  }

  private processMove(input: string): boolean {
    const coordinates = input.split(' ');
    if (coordinates.length !== 2) {
      console.log(
        chalk.red(
          'Invalid move! Please enter moves in format: from to (e.g., "e2,e4" or "1,4 3,4")',
        ),
      );
      this.waitForKeyPress();
      return false;
    }
    const from = Position.parse(coordinates[0]);
    const to = Position.parse(coordinates[1]);

    const valid = this.board.movePiece(from, to);

    if (!valid) {
      console.log(chalk.red('Invalid move! Please try again.'));
      this.waitForKeyPress();
      return false;
    }

    console.log(
      chalk.green(
        `${this.currentPlayer} moved from ${from.toAlgebraic()} to ${to.toAlgebraic()}`,
      ),
    );

    return valid;
  }

  private handleGameCommand(input: string): boolean {
    const command = input.toLowerCase();

    switch (command) {
      case 'quit': {
        const confirm = readlineSync.keyInYNStrict(
          chalk.yellow('Are you sure you want to quit?'),
        );

        if (confirm) {
          console.log(chalk.yellow('Exiting the game...'));
          this.gameStatus = GameStatus.STOP;
        }

        return true;
      }

      case 'help':
        GameDisplay.displayHelp();
        this.waitForKeyPress();
        return true;

      case 'history':
        // TODO: Implement move history display
        this.waitForKeyPress();
        return true;

      case 'status':
        // TODO: Implement status display
        this.waitForKeyPress();
        return true;

      default:
        return true;
    }
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === PieceColor.WHITE
        ? PieceColor.BLACK
        : PieceColor.WHITE;
  }

  private waitForKeyPress(): void {
    readlineSync.question(chalk.gray('\nPress Enter to continue...'));
  }
}
