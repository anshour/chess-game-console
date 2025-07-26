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
        this.processMove(input);
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

  private processMove(input: string): void {
    const coordinates = this.parseCoordinates(input);

    const [from, to] = coordinates;

    const piece = this.board.getPieceAt(from);

    if (piece && !this.isValidTurn(piece)) {
      throw new Error("Invalid turn! It's not your piece.");
    }

    this.board.movePiece(from, to);

    this.display.showSuccessMove(this.currentPlayer, from, to);
  }

  private isValidTurn(piece: Piece): boolean {
    return piece.color === this.currentPlayer;
  }

  private parseCoordinates(input: string): [Position, Position] {
    const coordinates = input.includes(' ')
      ? input.split(' ')
      : input.split(',');

    if (coordinates.length !== 2) {
      throw new Error(
        'Invalid move! Please enter moves in format: from to (e.g., "e2,e4" or "1,4 3,4")',
      );
    }

    const from = Position.parse(coordinates[0]);
    const to = Position.parse(coordinates[1]);

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
