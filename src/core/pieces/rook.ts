import { PieceColor, PieceType } from '../../utils/enums';
import { Board } from '../board';
import { Position } from '../position';
import { Piece } from './piece';

export class Rook extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.ROOK, position);
  }

  private getBasicMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    for (const [rankDir, fileDir] of directions) {
      let rank = this.position.rankIndex + rankDir;
      let file = this.position.fileIndex + fileDir;

      while (board.areCoordinatesWithinBoard(rank, file)) {
        const pos = new Position(rank, file);
        moves.push(pos);

        if (!this.isEmpty(pos, board)) {
          break;
        }

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
