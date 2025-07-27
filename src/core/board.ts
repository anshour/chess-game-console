import { PieceColor, PieceType } from '../utils/enums.js';
import { Bishop } from './pieces/bishop.js';
import { King } from './pieces/king.js';
import { Knight } from './pieces/knight.js';
import { Pawn } from './pieces/pawn.js';
import { Piece } from './pieces/piece.js';
import { Queen } from './pieces/queen.js';
import { Rook } from './pieces/rook.js';
import { Position } from './position.js';
import { Move } from './types.js';

export class Board {
  private board: (Piece | null)[][] = [];
  private capturedKing: Piece | null = null;
  private capturedPieces: { white: Piece[]; black: Piece[] } = {
    white: [],
    black: [],
  };

  constructor() {
    this.initializeBoard();
  }

  private initializeBoard(): void {
    console.log('Initializing chess board...');

    // Initialize empty board
    for (let rank = 0; rank < 8; rank++) {
      this.board[rank] = [];
      for (let file = 0; file < 8; file++) {
        this.board[rank][file] = null;
      }
    }

    // Place white pieces
    this.placePiece(new Rook(PieceColor.WHITE, new Position(0, 0)));
    this.placePiece(new Knight(PieceColor.WHITE, new Position(0, 1)));
    this.placePiece(new Bishop(PieceColor.WHITE, new Position(0, 2)));
    this.placePiece(new Queen(PieceColor.WHITE, new Position(0, 3)));
    this.placePiece(new King(PieceColor.WHITE, new Position(0, 4)));
    this.placePiece(new Bishop(PieceColor.WHITE, new Position(0, 5)));
    this.placePiece(new Knight(PieceColor.WHITE, new Position(0, 6)));
    this.placePiece(new Rook(PieceColor.WHITE, new Position(0, 7)));

    // Place white pawns
    for (let file = 0; file < 8; file++) {
      this.placePiece(new Pawn(PieceColor.WHITE, new Position(1, file)));
    }

    // Place black pieces
    this.placePiece(new Rook(PieceColor.BLACK, new Position(7, 0)));
    this.placePiece(new Knight(PieceColor.BLACK, new Position(7, 1)));
    this.placePiece(new Bishop(PieceColor.BLACK, new Position(7, 2)));
    this.placePiece(new Queen(PieceColor.BLACK, new Position(7, 3)));
    this.placePiece(new King(PieceColor.BLACK, new Position(7, 4)));
    this.placePiece(new Bishop(PieceColor.BLACK, new Position(7, 5)));
    this.placePiece(new Knight(PieceColor.BLACK, new Position(7, 6)));
    this.placePiece(new Rook(PieceColor.BLACK, new Position(7, 7)));

    // Place black pawns
    for (let file = 0; file < 8; file++) {
      this.placePiece(new Pawn(PieceColor.BLACK, new Position(6, file)));
    }
  }

  private placePiece(piece: Piece): void {
    this.board[piece.position.rankIndex][piece.position.fileIndex] = piece;
  }

  getPieceAt(position: Position): Piece | null {
    return this.board[position.rankIndex][position.fileIndex];
  }

  isValidMove(move: Move): boolean {
    const { from, to } = move;

    const piece = this.getPieceAt(from);
    if (!piece) {
      return false;
    }
    return piece.isValidMove(to, this);
  }

  movePiece(move: Move): boolean {
    const { from, to } = move;

    if (!this.isValidMove(move)) {
      throw new Error(
        'Invalid move! Please check the piece and target position.',
      );
    }

    const piece = this.getPieceAt(from);
    const capturedPiece = this.getPieceAt(to);

    if (capturedPiece) {
      if (capturedPiece.color === PieceColor.WHITE) {
        this.capturedPieces.white.push(capturedPiece);
      } else {
        this.capturedPieces.black.push(capturedPiece);
      }

      if (capturedPiece.type === PieceType.KING) {
        this.capturedKing = capturedPiece;
      }
    }

    this.board[from.rankIndex][from.fileIndex] = null;

    piece.position = to;

    this.board[to.rankIndex][to.fileIndex] = piece;

    return true;
  }

  getCapturedKing(): Piece | null {
    return this.capturedKing;
  }

  // TODO: MOVE TO PAWN
  canBePromoted(piece: Piece): boolean {
    if (piece.type !== PieceType.PAWN) {
      return false;
    }

    if (piece.color === PieceColor.WHITE && piece.position.rankIndex === 7) {
      return true;
    }

    if (piece.color === PieceColor.BLACK && piece.position.rankIndex === 0) {
      return true;
    }

    return false;
  }

  promotePawn(position: Position, promotionType: PieceType): void {
    const piece = this.getPieceAt(position);

    if (!piece || piece.type !== PieceType.PAWN) {
      throw new Error('No pawn at the specified position to promote');
    }

    if (!this.canBePromoted(piece)) {
      throw new Error('Pawn cannot be promoted from this position');
    }

    this.board[position.rankIndex][position.fileIndex] = null;

    let newPiece: Piece;
    switch (promotionType) {
      case PieceType.QUEEN:
        newPiece = new Queen(piece.color, position);
        break;
      case PieceType.ROOK:
        newPiece = new Rook(piece.color, position);
        break;
      case PieceType.BISHOP:
        newPiece = new Bishop(piece.color, position);
        break;
      case PieceType.KNIGHT:
        newPiece = new Knight(piece.color, position);
        break;
      default:
        throw new Error(`Invalid promotion type: ${promotionType}`);
    }

    this.board[position.rankIndex][position.fileIndex] = newPiece;
  }

  getCapturedPieces(): { white: string[]; black: string[] } {
    return {
      white: this.capturedPieces.white.map((piece) => piece.type),
      black: this.capturedPieces.black.map((piece) => piece.type),
    };
  }
}
