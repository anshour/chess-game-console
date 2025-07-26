import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';
import { Piece } from './piece.js';

export class Pawn extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(color, PieceType.PAWN, position);
  }

  isValidMove(to: Position, board: Board): boolean {
    const direction = this.color === PieceColor.WHITE ? 1 : -1;
    const startRank = this.color === PieceColor.WHITE ? 1 : 6;

    const rankDiff = to.rankIndex - this.position.rankIndex;
    const fileDiff = Math.abs(to.fileIndex - this.position.fileIndex);

    if (fileDiff === 0 && rankDiff === direction) {
      return this.isEmpty(to, board);
    }

    if (
      fileDiff === 0 &&
      rankDiff === 2 * direction &&
      this.position.rankIndex === startRank
    ) {
      return (
        this.isEmpty(to, board) &&
        this.isEmpty(
          new Position(
            this.position.rankIndex + direction,
            this.position.fileIndex,
          ),
          board,
        )
      );
    }

    if (fileDiff === 1 && rankDiff === direction) {
      return this.isEnemyPiece(to, board);
    }

    return false;
  }

  getPossibleMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const direction = this.color === PieceColor.WHITE ? 1 : -1;

    const oneForward = new Position(
      this.position.rankIndex + direction,
      this.position.fileIndex,
    );
    if (
      this.isValidPosition(oneForward) &&
      this.isValidMove(oneForward, board)
    ) {
      moves.push(oneForward);

      const twoForward = new Position(
        this.position.rankIndex + 2 * direction,
        this.position.fileIndex,
      );
      if (
        this.isValidPosition(twoForward) &&
        this.isValidMove(twoForward, board)
      ) {
        moves.push(twoForward);
      }
    }

    for (const fileOffset of [-1, 1]) {
      const diagonal = new Position(
        this.position.rankIndex + direction,
        this.position.fileIndex + fileOffset,
      );
      if (this.isValidPosition(diagonal) && this.isValidMove(diagonal, board)) {
        moves.push(diagonal);
      }
    }

    return moves;
  }

  private isValidPosition(position: Position): boolean {
    return (
      position.rankIndex >= 0 &&
      position.rankIndex <= 7 &&
      position.fileIndex >= 0 &&
      position.fileIndex <= 7
    );
  }
}
