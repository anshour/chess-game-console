import chalk from 'chalk';
import { Board } from './board.js';
import { GameStatus, PieceColor } from '../utils/enums.js';
import readlineSync from 'readline-sync';
import { GameDisplay } from './game-display.js';
import { Position } from './position.js';
import { Piece } from './pieces/piece.js';

export class GameEngine {
  private board: Board;
  private display: GameDisplay;
  // TODO: ADD PLAYER NAME
  private currentPlayer: PieceColor;
  private gameStatus: GameStatus;

  // TODO: ADD MOVE HISTORY
  // private moveHistory: Move[];

  // TODO: ADD REPLAY FUNCTIONALITY

  constructor() {
    this.board = new Board();
    this.display = new GameDisplay();
    this.currentPlayer = PieceColor.WHITE;
    this.gameStatus = GameStatus.PLAYING;
  }

  public start(): void {
    this.display.showWelcome();
    this.gameLoop();
  }

  private gameLoop(): void {
    while (this.gameStatus === GameStatus.PLAYING) {
      try {
        this.display.showBoard(this.board);
        this.display.showGameInfo(this.currentPlayer);

        const input = this.getPlayerInput();
        if (this.isGameCommand(input)) {
          if (!this.handleGameCommand(input)) {
            break; // Exit game
          }
          continue;
        }
        if (!this.processMove(input)) {
          continue;
        }

        this.switchPlayer();
      } catch (error) {
        this.display.showError(
          error instanceof Error ? error.message : 'Unknown error occurred',
        );
        this.waitForKeyPress();
      }
    }
    this.display.showGameEnd(this.gameStatus);
  }

  private getPlayerInput(): string {
    const prompt = chalk.green(`${this.currentPlayer}, enter your move: `);
    return readlineSync.question(prompt).trim();
  }

  private isGameCommand(input: string): boolean {
    const commands = ['quit', 'help', 'history', 'status'];
    return commands.includes(input.toLowerCase());
  }

  private processMove(input: string): boolean {
    const coordinates = this.parseCoordinates(input);

    if (!coordinates) {
      this.display.showInvalidCoordinate();
      this.waitForKeyPress();
      return false;
    }

    const [from, to] = coordinates;

    const piece = this.board.getPieceAt(from);

    if (!piece) {
      this.display.showPieceNotFound();
      this.waitForKeyPress();
      return false;
    }

    if (!this.isValidTurn(piece)) {
      this.display.showInvalidTurn();
      this.waitForKeyPress();
      return false;
    }

    const success = this.board.movePiece(from, to);

    if (!success) {
      this.display.showInvalidMove();
      this.waitForKeyPress();
      return false;
    }

    this.display.showSuccessMove(this.currentPlayer, from, to);

    return success;
  }

  private isValidTurn(piece: Piece): boolean {
    return piece.color === this.currentPlayer;
  }

  private parseCoordinates(input: string): [Position, Position] | null {
    const coordinates = input.includes(' ')
      ? input.split(' ')
      : input.split(',');

    if (coordinates.length !== 2) return null;

    const from = Position.parse(coordinates[0]);
    const to = Position.parse(coordinates[1]);

    if (!from || !to) {
      return null;
    }

    return [from, to];
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
          return false; // Exit game loop
        }
        return true;
      }

      case 'help':
        this.display.showHelp();
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
