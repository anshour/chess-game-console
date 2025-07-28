import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Knight extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.KNIGHT, position);
  }

  private getBasicMoves(board: Board): Position[] {
    const offsets = [
      [2, 1], // up-right
      [2, -1], // up-left
      [-2, 1], // down-right
      [-2, -1], // down-left
      [1, 2], // right-up
      [1, -2], // right-down
      [-1, 2], // left-up
      [-1, -2], // left-down
    ];
    const positions: Position[] = [];

    for (const [rankOffset, fileOffset] of offsets) {
      const newRank = this.position.rankIndex + rankOffset;
      const newFile = this.position.fileIndex + fileOffset;

      if (board.areCoordinatesWithinBoard(newRank, newFile)) {
        positions.push(new Position(newRank, newFile));
      }
    }

    return positions.filter((pos) => this.isEmpty(pos, board));
  }

  getMovementMoves(board: Board): Position[] {
    return this.getBasicMoves(board).filter((pos) => this.isEmpty(pos, board));
  }

  getAttackMoves(board: Board): Position[] {
    return this.getBasicMoves(board).filter((pos) =>
      this.isEnemyPiece(pos, board),
    );
  }
}
