import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Rook extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.ROOK, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    if (
      this.position.rankIndex !== to.rankIndex &&
      this.position.fileIndex !== to.fileIndex
    ) {
      return false;
    }

    if (!this.isPathClear(this.position, to, board)) {
      return false;
    }

    return this.isEmpty(to, board) || this.isEnemyPiece(to, board);
  }
}
