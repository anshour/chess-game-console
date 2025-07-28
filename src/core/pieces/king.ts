import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class King extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KING, position);
  }

  private getCastlingMoves(board: Board): Position[] {
    const moves: Position[] = [];
    if (this.hasMoved || board.isKingInCheck(this.color)) {
      return [];
    }

    const rank = this.position.rankIndex;
    const opponentColor =
      this.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    // 1. Rokade sisi Raja (Kingside, O-O)
    const kingsideRook = board.getPieceAt(new Position(rank, 7));
    if (
      kingsideRook &&
      kingsideRook.type === PieceType.ROOK &&
      !kingsideRook.hasMoved
    ) {
      const pathClear =
        !board.getPieceAt(new Position(rank, 5)) &&
        !board.getPieceAt(new Position(rank, 6));
      if (pathClear) {
        const pathSafe =
          !board.isSquareAttacked(new Position(rank, 5), opponentColor) &&
          !board.isSquareAttacked(new Position(rank, 6), opponentColor);
        if (pathSafe) {
          moves.push(new Position(rank, 6));
        }
      }
    }

    // 2. Rokade sisi Ratu (Queenside, O-O-O)
    const queensideRook = board.getPieceAt(new Position(rank, 0));
    if (
      queensideRook &&
      queensideRook.type === PieceType.ROOK &&
      !queensideRook.hasMoved
    ) {
      const pathClear =
        !board.getPieceAt(new Position(rank, 1)) &&
        !board.getPieceAt(new Position(rank, 2)) &&
        !board.getPieceAt(new Position(rank, 3));
      if (pathClear) {
        const pathSafe =
          !board.isSquareAttacked(new Position(rank, 2), opponentColor) &&
          !board.isSquareAttacked(new Position(rank, 3), opponentColor);
        if (pathSafe) {
          moves.push(new Position(rank, 2));
        }
      }
    }

    return moves;
  }

  private getBasicMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [rankDir, fileDir] of directions) {
      const newRank = this.position.rankIndex + rankDir;
      const newFile = this.position.fileIndex + fileDir;

      if (board.areCoordinatesWithinBoard(newRank, newFile)) {
        const newPosition = new Position(newRank, newFile);
        moves.push(newPosition);
      }
    }

    return moves;
  }

  getMovementMoves(board: Board): Position[] {
    const moves = this.getBasicMoves(board).filter((pos) =>
      this.isEmpty(pos, board),
    );

    const castlingMoves = this.getCastlingMoves(board);
    moves.push(...castlingMoves);

    return moves;
  }

  getAttackMoves(board: Board): Position[] {
    return this.getBasicMoves(board).filter((pos) =>
      this.isEnemyPiece(pos, board),
    );
  }
}
