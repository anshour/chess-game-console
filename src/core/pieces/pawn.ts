import { PieceColor, PieceType } from '../../utils/enums';
import { Board } from '../board';
import { Position } from '../position';
import { Piece } from './piece';

export class Pawn extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.PAWN, position);
  }

  getMovementMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const direction = this.color === PieceColor.WHITE ? 1 : -1;
    const currentRank = this.position.rankIndex;
    const currentFile = this.position.fileIndex;

    const oneStepRank = currentRank + direction;
    if (!board.areCoordinatesWithinBoard(oneStepRank, currentFile)) {
      return moves;
    }

    const oneStepForward = new Position(oneStepRank, currentFile);
    if (this.isEmpty(oneStepForward, board)) {
      moves.push(oneStepForward);

      if (!this.hasMoved) {
        const twoStepRank = currentRank + 2 * direction;
        if (!board.areCoordinatesWithinBoard(twoStepRank, currentFile)) {
          return moves;
        }
        const twoStepsForward = new Position(twoStepRank, currentFile);

        if (this.isEmpty(twoStepsForward, board)) {
          moves.push(twoStepsForward);
        }
      }
    }
    return moves;
  }

  getAttackMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const direction = this.color === PieceColor.WHITE ? 1 : -1;
    const attackRank = this.position.rankIndex + direction;

    const attackFiles = [
      this.position.fileIndex - 1,
      this.position.fileIndex + 1,
    ];

    for (const attackFile of attackFiles) {
      if (board.areCoordinatesWithinBoard(attackRank, attackFile)) {
        const pos = new Position(attackRank, attackFile);

        if (this.isEnemyPiece(pos, board)) {
          moves.push(pos);
        }

        if (
          board.getEnPassantTarget() &&
          pos.equals(board.getEnPassantTarget())
        ) {
          moves.push(pos);
        }
      }
    }
    return moves;
  }
}
