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
}
