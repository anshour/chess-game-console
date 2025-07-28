import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Bishop extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.BISHOP, position);
  }

  private getBasicMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [rankDir, fileDir] of directions) {
      let rank = this.position.rankIndex + rankDir;
      let file = this.position.fileIndex + fileDir;

      while (board.areCoordinatesWithinBoard(rank, file)) {
        const pos = new Position(rank, file);

        moves.push(pos);

        rank += rankDir;
        file += fileDir;
      }
    }

    return moves;
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
