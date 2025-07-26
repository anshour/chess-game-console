import { PieceColor, PieceType } from '../../utils/enums.js';
import { Board } from '../board.js';
import { Position } from '../position.js';

export abstract class Piece {
  constructor(
    public readonly color: PieceColor,
    public readonly type: PieceType,
    public position: Position,
  ) {}

  abstract isValidMove(to: Position, board: Board): boolean;

  protected isPathClear(from: Position, to: Position, board: Board): boolean {
    const rankDiff = to.rankIndex - from.rankIndex;
    const fileDiff = to.fileIndex - from.fileIndex;

    const rankStep = rankDiff === 0 ? 0 : rankDiff > 0 ? 1 : -1;
    const fileStep = fileDiff === 0 ? 0 : fileDiff > 0 ? 1 : -1;

    let currentRank = from.rankIndex + rankStep;
    let currentFile = from.fileIndex + fileStep;

    while (currentRank !== to.rankIndex || currentFile !== to.fileIndex) {
      if (board.getPieceAt(new Position(currentRank, currentFile))) {
        return false;
      }
      currentRank += rankStep;
      currentFile += fileStep;
    }

    return true;
  }

  protected isEnemyPiece(position: Position, board: Board): boolean {
    const piece = board.getPieceAt(position);
    return piece !== null && piece.color !== this.color;
  }

  protected isEmpty(position: Position, board: Board): boolean {
    return board.getPieceAt(position) === null;
  }
}
