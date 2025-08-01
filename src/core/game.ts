import { GameStatus, MoveStatus, PieceColor, PieceType } from '../utils/enums';
import { Board } from './board';
import { Piece } from './pieces/piece';
import { Player } from './player';
import { Position } from './position';
import { Move } from './types';

export class Game {
  private board: Board;
  private whitePlayer: Player;
  private blackPlayer: Player;
  private currentPlayer: Player;
  private status: GameStatus;
  private moveHistory: Move[];
  private moveCount: number;

  constructor() {
    this.board = new Board();
    this.whitePlayer = new Player(PieceColor.WHITE, 'White');
    this.blackPlayer = new Player(PieceColor.BLACK, 'Black');
    this.currentPlayer = this.whitePlayer;
    this.status = GameStatus.PLAYING;
    this.moveHistory = [];
    this.moveCount = 0;
  }

  makeMove(move: Move): MoveStatus {
    const piece = this.board.getPieceAt(move.from);

    if (!piece) {
      throw new Error(`No piece found at ${move.from.toAlgebraic()}`);
    }

    if (!this.isValidTurn(piece)) {
      throw new Error("Invalid turn! It's not your piece.");
    }

    this.board.movePiece(move);

    this.recordMove(move);

    const canBePromoted = this.board.canBePromoted(piece);

    if (canBePromoted) {
      return MoveStatus.PROMOTION;
    }

    const kingCaptured = this.board.getCapturedKing();

    if (kingCaptured) {
      this.status =
        kingCaptured.color === PieceColor.WHITE
          ? GameStatus.BLACK_WINS
          : GameStatus.WHITE_WINS;

      return MoveStatus.KING_CAPTURED;
    }

    this.switchPlayer();

    const isCheckmate = this.board.isCheckmate(this.currentPlayer.color);
    if (isCheckmate) {
      this.status =
        this.currentPlayer.color === PieceColor.WHITE
          ? GameStatus.BLACK_WINS
          : GameStatus.WHITE_WINS;

      return MoveStatus.CHECKMATE;
    }

    return MoveStatus.SUCCESS;
  }

  setWhitePlayerName(name: string): void {
    this.whitePlayer = new Player(PieceColor.WHITE, name);
    if (this.currentPlayer.color === PieceColor.WHITE) {
      this.currentPlayer = this.whitePlayer;
    }
  }

  setBlackPlayerName(name: string): void {
    this.blackPlayer = new Player(PieceColor.BLACK, name);
    if (this.currentPlayer.color === PieceColor.BLACK) {
      this.currentPlayer = this.blackPlayer;
    }
  }

  private isValidTurn(piece: Piece): boolean {
    return piece.color === this.currentPlayer.color;
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer.color === PieceColor.WHITE
        ? this.blackPlayer
        : this.whitePlayer;
  }

  private recordMove(move: Move): void {
    this.moveHistory.push(move);
    this.moveCount++;
  }

  public promotePawn(position: Position, pieceType: PieceType): void {
    this.board.promotePawn(position, pieceType);
    this.switchPlayer();
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getBoard(): Board {
    return this.board;
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  public isGameOver(): boolean {
    return this.status !== GameStatus.PLAYING;
  }
}
