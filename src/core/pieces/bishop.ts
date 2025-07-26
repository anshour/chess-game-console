import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Bishop extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.BISHOP, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    const rankDiff = Math.abs(to.rankIndex - this.position.rankIndex);
    const fileDiff = Math.abs(to.fileIndex - this.position.fileIndex);

    if (rankDiff !== fileDiff) {
      return false;
    }

    if (!this.isPathClear(this.position, to, board)) {
      return false;
    }

    return this.isEmpty(to, board) || this.isEnemyPiece(to, board);
  }
}
