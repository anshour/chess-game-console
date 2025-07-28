import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class King extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KING, position);
  }

  getMovementMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [1, 0],   // up
      [-1, 0],  // down
      [0, 1],   // right
      [0, -1],  // left
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];

    for (const [rankDir, fileDir] of directions) {
      const newRank = this.position.rankIndex + rankDir;
      const newFile = this.position.fileIndex + fileDir;

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
    const directions = [
      [1, 0],   // up
      [-1, 0],  // down
      [0, 1],   // right
      [0, -1],  // left
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];

    for (const [rankDir, fileDir] of directions) {
      const newRank = this.position.rankIndex + rankDir;
      const newFile = this.position.fileIndex + fileDir;

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
