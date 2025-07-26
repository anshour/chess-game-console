import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Queen extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.QUEEN, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    const rankDiff = Math.abs(to.rankIndex - this.position.rankIndex);
    const fileDiff = Math.abs(to.fileIndex - this.position.fileIndex);

    const isRookMove =
      this.position.rankIndex === to.rankIndex ||
      this.position.fileIndex === to.fileIndex;
    const isBishopMove = rankDiff === fileDiff;

    if (!isRookMove && !isBishopMove) {
      return false;
    }

    if (!this.isPathClear(this.position, to, board)) {
      return false;
    }

    return this.isEmpty(to, board) || this.isEnemyPiece(to, board);
  }
}
