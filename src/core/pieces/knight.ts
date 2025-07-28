import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Knight extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KNIGHT, position);
  }

  getMovementMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const knightMoves = [
      [2, 1],   // up 2, right 1
      [2, -1],  // up 2, left 1
      [-2, 1],  // down 2, right 1
      [-2, -1], // down 2, left 1
      [1, 2],   // right 2, up 1
      [1, -2],  // left 2, up 1
      [-1, 2],  // right 2, down 1
      [-1, -2]  // left 2, down 1
    ];

    for (const [rankOffset, fileOffset] of knightMoves) {
      const newRank = this.position.rankIndex + rankOffset;
      const newFile = this.position.fileIndex + fileOffset;

      if (board.areCoordinatesWithinBoard(newRank, newFile)) {
        const newPosition = new Position(newRank, newFile);

        if (this.isEmpty(newPosition, board)) {
          moves.push(newPosition);
        }
      }
    }

    return moves;
  }

  getAttackMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const knightMoves = [
      [2, 1],   // up 2, right 1
      [2, -1],  // up 2, left 1
      [-2, 1],  // down 2, right 1
      [-2, -1], // down 2, left 1
      [1, 2],   // right 2, up 1
      [1, -2],  // left 2, up 1
      [-1, 2],  // right 2, down 1
      [-1, -2]  // left 2, down 1
    ];

    for (const [rankOffset, fileOffset] of knightMoves) {
      const newRank = this.position.rankIndex + rankOffset;
      const newFile = this.position.fileIndex + fileOffset;

      if (board.areCoordinatesWithinBoard(newRank, newFile)) {
        const newPosition = new Position(newRank, newFile);

        if (this.isEnemyPiece(newPosition, board)) {
          moves.push(newPosition);
        }
      }
    }

    return moves;
  }
}
