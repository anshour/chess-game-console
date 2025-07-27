import { Game } from '../core/game.js';
import { Move } from '../core/types.js';
import { MoveStatus, PieceColor } from '../utils/enums.js';
import { InputHandler } from './input-handler.js';
import { Renderer } from './renderer.js';

export class CliController {
  constructor(
    private game: Game = new Game(),
    private renderer: Renderer = new Renderer(),
    private inputHandler: InputHandler = new InputHandler(),
  ) {}

  start(): void {
    this.initializeGame();
    this.runGameLoop();
    this.endGame();
  }

  private initializeGame(): void {
    this.renderer.showWelcome();
    this.inputHandler.waitForKeyPress();
    this.fillPlayerName();
  }

  private runGameLoop(): void {
    while (!this.game.isGameOver()) {
      try {
        this.playTurn();
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  private playTurn(): void {
    this.displayGameState();
    const move = this.getPlayerMove();
    this.processMove(move);
  }

  private displayGameState(): void {
    const board = this.game.getBoard();
    const currentPlayer = this.game.getCurrentPlayer();

    this.renderer.showBoard(board);
    this.renderer.showGameInfo(currentPlayer, board.getCapturedPieces());
  }

  private getPlayerMove(): Move {
    const currentPlayer = this.game.getCurrentPlayer();
    return this.inputHandler.promptForPlayerMove(currentPlayer);
  }

  private processMove(move: Move): void {
    const status = this.game.makeMove(move);

    const moveHandlers = {
      [MoveStatus.SUCCESS]: (): void => this.handleSuccessfulMove(move),
      [MoveStatus.PROMOTION]: (): void => this.handlePromotion(move),
      [MoveStatus.KING_CAPTURED]: (): void => this.handleGameEnd(),
    };

    const handler = moveHandlers[status];
    if (handler) {
      handler();
    } else {
      this.renderer.showError(`Invalid move status: ${status}`);
    }
  }

  private handleSuccessfulMove(move: Move): void {
    const currentPlayer = this.game.getCurrentPlayer();
    this.renderer.showSuccessMove(currentPlayer, move.from, move.to);
  }

  private handlePromotion(move: Move): void {
    const pieceType = this.inputHandler.promptForPromotion();
    this.game.promotePawn(move.to, pieceType);
  }

  private handleGameEnd(): void {
    this.renderer.showGameEnd(this.game.getStatus());
  }

  private endGame(): void {
    this.renderer.showGameEnd(this.game.getStatus());
  }

  private fillPlayerName(): void {
    try {
      const whitePlayerName = this.getValidPlayerName(PieceColor.WHITE);
      const blackPlayerName = this.getValidPlayerName(PieceColor.BLACK);

      this.game.setWhitePlayerName(whitePlayerName);
      this.game.setBlackPlayerName(blackPlayerName);
    } catch (error) {
      this.handleError(error);
      this.fillPlayerName();
    }
  }

  private getValidPlayerName(color: PieceColor): string {
    const name = this.inputHandler.promptForPlayerName(color);
    if (!name || name.trim().length === 0) {
      throw new Error('Player name cannot be empty');
    }

    if (name.length > 20) {
      throw new Error('Player name cannot exceed 20 characters');
    }
    return name.trim();
  }

  private handleError(error: unknown): void {
    const errorMessage = this.getErrorMessage(error);
    this.renderer.showError(errorMessage);
    this.inputHandler.waitForKeyPress();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
