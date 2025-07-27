import chalk from 'chalk';
import { Board } from './board.js';
import { GameStatus, PieceColor, PieceType, Move } from '../utils/enums.js';
import readlineSync from 'readline-sync';
import { GameDisplay } from './game-display.js';
import { Position } from './position.js';
import { Piece } from './pieces/piece.js';
import { Player } from './player.js';

export class GameEngine {
  private board: Board;
  private display: GameDisplay;
  private whitePlayer: Player;
  private blackPlayer: Player;
  private currentPlayer: Player;
  private gameStatus: GameStatus;
  private moveHistory: Move[];
  private moveCount: number;

  constructor() {
    this.board = new Board();
    this.display = new GameDisplay();
    this.whitePlayer = new Player(PieceColor.WHITE, 'White');
    this.blackPlayer = new Player(PieceColor.BLACK, 'Black');
    this.currentPlayer = this.whitePlayer;
    this.gameStatus = GameStatus.PLAYING;
    this.moveHistory = [];
    this.moveCount = 0;
  }

  public start(): void {
    this.display.showWelcome();
    this.initializePlayers();
    this.gameLoop();
  }

  private initializePlayers(): void {
    this.display.showTitle('Player Setup');

    const whiteName = readlineSync
      .question(chalk.white('Enter name for White player: '), {
        defaultInput: 'White Player',
      })
      .trim();

    const blackName = readlineSync
      .question(chalk.yellow('Enter name for Black player: '), {
        defaultInput: 'Black Player',
      })
      .trim();

    this.whitePlayer = new Player(PieceColor.WHITE, whiteName);
    this.blackPlayer = new Player(PieceColor.BLACK, blackName);

    this.currentPlayer = this.whitePlayer;

    console.log(
      chalk.green(
        `\nGame starting! ${this.whitePlayer.getDisplayName()} vs ${this.blackPlayer.getDisplayName()}`,
      ),
    );
    readlineSync.question(chalk.gray('\nPress Enter to begin...'));
  }

  private gameLoop(): void {
    while (this.gameStatus === GameStatus.PLAYING) {
      try {
        this.display.showBoard(this.board);
        this.display.showGameInfo(
          this.currentPlayer,
          this.board.getCapturedPieces(),
        );

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
    this.promptRestart();
  }

  private promptRestart(): void {
    const confirm = readlineSync.keyInYNStrict(
      chalk.yellow('Do you want to restart the game?'),
    );

    if (confirm) {
      this.restartGame();
    }
  }

  private restartGame(): void {
    this.board = new Board();
    this.moveHistory = [];
    this.moveCount = 0;
    this.currentPlayer = this.whitePlayer;
    this.gameStatus = GameStatus.PLAYING;

    this.start();
  }

  private getPlayerInput(): string {
    const prompt = chalk.green(
      `${this.currentPlayer.getDisplayName()}, enter your move: `,
    );
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

    if (!piece) {
      throw new Error(`No piece found at ${from.toAlgebraic()}`);
    }

    if (!this.isValidTurn(piece)) {
      throw new Error("Invalid turn! It's not your piece.");
    }

    this.board.movePiece(from, to);

    this.recordMove(from, to);

    const isPromotion = this.board.isPromotionMove(piece, to);

    if (isPromotion) {
      const promotionType = this.promptForPromotion();
      this.board.promotePawn(to, promotionType);
      this.display.showPawnPromoted(this.currentPlayer, promotionType);
    }

    const kingCaptured = this.board.getCapturedKing();
    if (kingCaptured) {
      this.gameStatus =
        kingCaptured.color === PieceColor.WHITE
          ? GameStatus.BLACK_WINS
          : GameStatus.WHITE_WINS;
    }

    this.display.showSuccessMove(this.currentPlayer, from, to);
  }

  private isValidTurn(piece: Piece): boolean {
    return piece.color === this.currentPlayer.color;
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

        return !confirm; // Return true to continue game loop or false to exit
      }

      case 'help':
        this.display.showHelp();
        this.waitForKeyPress();
        return true;

      case 'history':
        this.display.showMoveHistory(this.moveHistory);
        this.waitForKeyPress();
        return true;

      default:
        return true;
    }
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer.color === PieceColor.WHITE
        ? this.blackPlayer
        : this.whitePlayer;
  }

  private recordMove(from: Position, to: Position): void {
    const move: Move = { from, to };
    this.moveHistory.push(move);
    this.moveCount++;
  }

  private promptForPromotion(): PieceType {
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

  private waitForKeyPress(): void {
    readlineSync.question(chalk.gray('\nPress Enter to continue...'));
  }
}
