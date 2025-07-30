import { Board } from '../src/core/board';
import { Piece } from '../src/core/pieces/piece';
import { Position } from '../src/core/position';
import { PieceColor } from '../src/utils/enums';

export function createEmptyBoard(): Board {
  const emptyBoard = new Board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      emptyBoard['board'][rank][file] = null;
    }
  }
  return emptyBoard;
}

export function createEmptyBoardWithPiece<T extends Piece>(
  pieceConstructor: new (color: PieceColor, position: Position) => T,
  color: PieceColor,
  position: Position,
): { board: Board; piece: T } {
  const board = createEmptyBoard();
  const piece = new pieceConstructor(color, position);
  board['board'][position.rankIndex][position.fileIndex] = piece;
  return { board, piece };
}

export function placePieceAt(
  board: Board,
  piece: Piece,
  position: Position,
): void {
  board['board'][position.rankIndex][position.fileIndex] = piece;
}

export function removePieceAt(board: Board, position: Position): void {
  board['board'][position.rankIndex][position.fileIndex] = null;
}

export function clearRank(board: Board, rankIndex: number): void {
  for (let file = 0; file < 8; file++) {
    board['board'][rankIndex][file] = null;
  }
}

export function clearFile(board: Board, fileIndex: number): void {
  for (let rank = 0; rank < 8; rank++) {
    board['board'][rank][fileIndex] = null;
  }
}

export function clearHorizontalPath(
  board: Board,
  rankIndex: number,
  startFile: number,
  endFile: number,
): void {
  const start = Math.min(startFile, endFile);
  const end = Math.max(startFile, endFile);
  for (let file = start; file <= end; file++) {
    board['board'][rankIndex][file] = null;
  }
}

export function clearVerticalPath(
  board: Board,
  fileIndex: number,
  startRank: number,
  endRank: number,
): void {
  const start = Math.min(startRank, endRank);
  const end = Math.max(startRank, endRank);
  for (let rank = start; rank <= end; rank++) {
    board['board'][rank][fileIndex] = null;
  }
}

export function clearDiagonalPath(
  board: Board,
  startPosition: Position,
  endPosition: Position,
): void {
  const rankDiff = endPosition.rankIndex - startPosition.rankIndex;
  const fileDiff = endPosition.fileIndex - startPosition.fileIndex;

  if (Math.abs(rankDiff) !== Math.abs(fileDiff)) {
    throw new Error('Not a diagonal path');
  }

  const rankStep = rankDiff > 0 ? 1 : -1;
  const fileStep = fileDiff > 0 ? 1 : -1;
  const steps = Math.abs(rankDiff);

  for (let i = 0; i <= steps; i++) {
    const rank = startPosition.rankIndex + i * rankStep;
    const file = startPosition.fileIndex + i * fileStep;
    board['board'][rank][file] = null;
  }
}

export function moveExists(
  moves: Position[],
  targetPosition: Position,
): boolean {
  return moves.some((move) => move.equals(targetPosition));
}

export function hasAllExpectedMoves(
  actualMoves: Position[],
  expectedMoves: Position[],
): boolean {
  return expectedMoves.every((expectedMove) =>
    moveExists(actualMoves, expectedMove),
  );
}

export function hasNoForbiddenMoves(
  actualMoves: Position[],
  forbiddenMoves: Position[],
): boolean {
  return forbiddenMoves.every(
    (forbiddenMove) => !moveExists(actualMoves, forbiddenMove),
  );
}

export function generateHorizontalPositions(
  fromPosition: Position,
): Position[] {
  const positions: Position[] = [];
  const { rankIndex } = fromPosition;

  for (let file = 0; file < 8; file++) {
    if (file !== fromPosition.fileIndex) {
      positions.push(new Position(rankIndex, file));
    }
  }
  return positions;
}

export function generateVerticalPositions(fromPosition: Position): Position[] {
  const positions: Position[] = [];
  const { fileIndex } = fromPosition;

  for (let rank = 0; rank < 8; rank++) {
    if (rank !== fromPosition.rankIndex) {
      positions.push(new Position(rank, fileIndex));
    }
  }
  return positions;
}
