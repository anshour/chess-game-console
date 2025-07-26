import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class King extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KING, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    const rankDiff = Math.abs(to.rankIndex - this.position.rankIndex);
    const fileDiff = Math.abs(to.fileIndex - this.position.fileIndex);

    if (rankDiff > 1 || fileDiff > 1) {
      return false;
    }

    if (rankDiff === 0 && fileDiff === 0) {
      return false;
    }

    return this.isEmpty(to, board) || this.isEnemyPiece(to, board);
  }

  getPossibleMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [rankOffset, fileOffset] of directions) {
      const newRank = this.position.rankIndex + rankOffset;
      const newFile = this.position.fileIndex + fileOffset;

      if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
        const newPos = new Position(newRank, newFile);
        if (this.isEmpty(newPos, board) || this.isEnemyPiece(newPos, board)) {
          moves.push(newPos);
        }
      }
    }

    return moves;
  }
}
