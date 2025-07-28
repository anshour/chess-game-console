import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Queen extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.QUEEN, position);
  }

  getMovementMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [0, 1],   // right
      [0, -1],  // left
      [1, 0],   // up
      [-1, 0],  // down
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];

    for (const [rankDir, fileDir] of directions) {
      let currentRank = this.position.rankIndex + rankDir;
      let currentFile = this.position.fileIndex + fileDir;

      while (board.areCoordinatesWithinBoard(currentRank, currentFile)) {
        const currentPosition = new Position(currentRank, currentFile);

        if (this.isEmpty(currentPosition, board)) {
          moves.push(currentPosition);
        } else {
          // Stop if we hit any piece (friend or enemy)
          break;
        }

        currentRank += rankDir;
        currentFile += fileDir;
      }
    }

    return moves;
  }

  getAttackMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [0, 1],   // right
      [0, -1],  // left
      [1, 0],   // up
      [-1, 0],  // down
      [1, 1],   // up-right
      [1, -1],  // up-left
      [-1, 1],  // down-right
      [-1, -1]  // down-left
    ];

    for (const [rankDir, fileDir] of directions) {
      let currentRank = this.position.rankIndex + rankDir;
      let currentFile = this.position.fileIndex + fileDir;

      while (board.areCoordinatesWithinBoard(currentRank, currentFile)) {
        const currentPosition = new Position(currentRank, currentFile);

        if (this.isEmpty(currentPosition, board)) {
          // Continue moving through empty squares
        } else if (this.isEnemyPiece(currentPosition, board)) {
          // Can attack enemy piece
          moves.push(currentPosition);
          break;
        } else {
          // Hit friendly piece, stop
          break;
        }

        currentRank += rankDir;
        currentFile += fileDir;
      }
    }

    return moves;
  }
}
