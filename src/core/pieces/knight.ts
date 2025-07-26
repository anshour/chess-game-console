import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Knight extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KNIGHT, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    const rankDiff = Math.abs(to.rankIndex - this.position.rankIndex);
    const fileDiff = Math.abs(to.fileIndex - this.position.fileIndex);

    const isLShape =
      (rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2);

    if (!isLShape) {
      return false;
    }

    return this.isEmpty(to, board) || this.isEnemyPiece(to, board);
  }
}
