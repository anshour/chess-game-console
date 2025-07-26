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

  getPossibleMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [rankDir, fileDir] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRank = this.position.rankIndex + rankDir * i;
        const newFile = this.position.fileIndex + fileDir * i;

        if (newRank < 0 || newRank > 7 || newFile < 0 || newFile > 7) break;

        const newPos = new Position(newRank, newFile);

        if (this.isEmpty(newPos, board)) {
          moves.push(newPos);
        } else if (this.isEnemyPiece(newPos, board)) {
          moves.push(newPos);
          break;
        } else {
          break; // Own piece blocks the way
        }
      }
    }

    return moves;
  }
}
