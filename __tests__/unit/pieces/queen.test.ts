import { describe, it, expect, beforeEach } from 'vitest';
import { Queen } from '../../../src/core/pieces/queen.js';
import { Board } from '../../../src/core/board.js';
import { Position } from '../../../src/core/position.js';
import { PieceColor, PieceType } from '../../../src/utils/enums.js';
import { Pawn } from '../../../src/core/pieces/pawn.js';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  removePieceAt,
  clearRank,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
  generateHorizontalPositions,
  generateVerticalPositions,
} from '../../test-helpers.js';

describe('Queen', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white queen with correct properties', () => {
      const position = new Position(0, 3);
      const queen = new Queen(PieceColor.WHITE, position);

      expect(queen.color).toBe(PieceColor.WHITE);
      expect(queen.type).toBe(PieceType.QUEEN);
      expect(queen.position.equals(position)).toBe(true);
      expect(queen.hasMoved).toBe(false);
    });

    it('should create a black queen with correct properties', () => {
      const position = new Position(7, 3);
      const queen = new Queen(PieceColor.BLACK, position);

      expect(queen.color).toBe(PieceColor.BLACK);
      expect(queen.type).toBe(PieceType.QUEEN);
      expect(queen.position.equals(position)).toBe(true);
      expect(queen.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should move horizontally, vertically, and diagonally on empty board', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const moves = queen.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(27);

      const horizontalMoves = generateHorizontalPositions(position);
      expect(hasAllExpectedMoves(moves, horizontalMoves)).toBe(true);

      const verticalMoves = generateVerticalPositions(position);
      expect(hasAllExpectedMoves(moves, verticalMoves)).toBe(true);

      const expectedDiagonalMoves = [
        new Position(5, 5),
        new Position(6, 6),
        new Position(7, 7),

        new Position(5, 3),
        new Position(6, 2),
        new Position(7, 1),

        new Position(3, 5),
        new Position(2, 6),
        new Position(1, 7),

        new Position(3, 3),
        new Position(2, 2),
        new Position(1, 1),
        new Position(0, 0),
      ];

      expect(hasAllExpectedMoves(moves, expectedDiagonalMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const friendlyPositions = [
        new Position(4, 6),
        new Position(6, 4),
        new Position(6, 6),
      ];

      friendlyPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.WHITE, pos), pos);
      });

      const moves = queen.getMovementMoves(emptyBoard);

      const forbiddenMoves = [
        ...friendlyPositions,

        new Position(4, 7),
        new Position(7, 4),
        new Position(7, 7),
      ];
      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);

      const allowedMoves = [
        new Position(4, 5),
        new Position(5, 4),
        new Position(5, 5),
      ];
      expect(hasAllExpectedMoves(moves, allowedMoves)).toBe(true);
    });

    it('should stop at enemy pieces but not include them in movement moves', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const enemyPositions = [
        new Position(4, 6),
        new Position(6, 4),
        new Position(6, 6),
      ];

      enemyPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.BLACK, pos), pos);
      });

      const moves = queen.getMovementMoves(emptyBoard);

      const forbiddenMoves = [
        ...enemyPositions,

        new Position(4, 7),
        new Position(7, 4),
        new Position(7, 7),
      ];
      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);

      const allowedMoves = [
        new Position(4, 5),
        new Position(5, 4),
        new Position(5, 5),
      ];
      expect(hasAllExpectedMoves(moves, allowedMoves)).toBe(true);
    });

    it('should have no movement moves from starting position due to blocked path', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;
      const moves = queen.getMovementMoves(board);

      expect(moves).toHaveLength(0);
    });

    it('should have moves when path is cleared', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      const positionsToClear = [
        new Position(1, 2),
        new Position(1, 3),
        new Position(1, 4),
        new Position(0, 2),
      ];

      positionsToClear.forEach((pos) => removePieceAt(board, pos));

      const moves = queen.getMovementMoves(board);

      expect(hasAllExpectedMoves(moves, positionsToClear)).toBe(true);
    });
  });

  describe('getAttackMoves', () => {
    it('should include squares with enemy pieces', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const enemyPositions = [
        new Position(4, 6),
        new Position(6, 4),
        new Position(6, 6),
        new Position(2, 2),
      ];

      enemyPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.BLACK, pos), pos);
      });

      const moves = queen.getAttackMoves(emptyBoard);

      expect(hasAllExpectedMoves(moves, enemyPositions)).toBe(true);
      expect(moves).toHaveLength(4);
    });

    it('should not include squares with friendly pieces', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const friendlyPositions = [
        new Position(4, 6),
        new Position(6, 4),
        new Position(6, 6),
      ];

      friendlyPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.WHITE, pos), pos);
      });

      const moves = queen.getAttackMoves(emptyBoard);

      expect(hasNoForbiddenMoves(moves, friendlyPositions)).toBe(true);
      expect(moves).toHaveLength(0);
    });

    it('should not include empty squares', () => {
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = queen.getAttackMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });

  describe('getAnyValidMoves', () => {
    it('should combine movement and attack moves', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const enemyPositions = [new Position(4, 6), new Position(6, 6)];

      enemyPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.BLACK, pos), pos);
      });

      const allMoves = queen.getAnyValidMoves(emptyBoard);

      const expectedMoves = [
        new Position(4, 5),
        new Position(4, 6),
        new Position(5, 5),
        new Position(6, 6),
        new Position(3, 4),
        new Position(5, 4),
      ];

      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid horizontal movement', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      clearRank(board, 0);
      placePieceAt(board, queen, new Position(0, 3));

      const testPositions = [
        new Position(0, 0),
        new Position(0, 7),
        new Position(0, 2),
      ];

      testPositions.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(true);
      });
    });

    it('should return true for valid vertical movement', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      removePieceAt(board, new Position(1, 3));

      const testPositions = [new Position(1, 3), new Position(2, 3)];

      testPositions.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(true);
      });
    });

    it('should return true for valid diagonal movement', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      const pathsToClear = [new Position(1, 2), new Position(1, 4)];

      pathsToClear.forEach((pos) => removePieceAt(board, pos));

      pathsToClear.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(true);
      });
    });

    it('should return true for valid attack move', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      removePieceAt(board, new Position(1, 3));
      placePieceAt(
        board,
        new Pawn(PieceColor.BLACK, new Position(2, 3)),
        new Position(2, 3),
      );

      expect(queen.isValidMove(new Position(2, 3), board)).toBe(true);
    });

    it('should return false for invalid knight-like move', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      const invalidMoves = [new Position(2, 2), new Position(1, 1)];

      invalidMoves.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(false);
      });
    });

    it('should return false for blocked path', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      const blockedMoves = [new Position(2, 3), new Position(2, 2)];

      blockedMoves.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(false);
      });
    });

    it('should return false for move to square with friendly piece', () => {
      const queen = board.getPieceAt(new Position(0, 3)) as Queen;

      const friendlySquares = [new Position(0, 2), new Position(1, 3)];

      friendlySquares.forEach((pos) => {
        expect(queen.isValidMove(pos, board)).toBe(false);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle queen at board edges', () => {
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = queen.getMovementMoves(emptyBoard);

      expect(moves.length).toBeGreaterThan(0);
      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);

      expect(moveExists(moves, new Position(0, 1))).toBe(true);
      expect(moveExists(moves, new Position(1, 0))).toBe(true);
      expect(moveExists(moves, new Position(1, 1))).toBe(true);
    });

    it('should handle queen at center with maximum mobility', () => {
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = queen.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(27);
    });

    it('should handle queen surrounded by pieces', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const surroundingPositions = [
        new Position(3, 3),
        new Position(3, 4),
        new Position(3, 5),
        new Position(4, 3),
        new Position(4, 5),
        new Position(5, 3),
        new Position(5, 4),
        new Position(5, 5),
      ];

      surroundingPositions.forEach((pos) => {
        placePieceAt(emptyBoard, new Pawn(PieceColor.WHITE, pos), pos);
      });

      const moves = queen.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });

    it('should move in straight lines only (no L-shapes or other patterns)', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const moves = queen.getMovementMoves(emptyBoard);

      for (const move of moves) {
        const rankDiff = move.rankIndex - 4;
        const fileDiff = move.fileIndex - 4;

        const isHorizontal = rankDiff === 0 && fileDiff !== 0;
        const isVertical = fileDiff === 0 && rankDiff !== 0;
        const isDiagonal =
          Math.abs(rankDiff) === Math.abs(fileDiff) && rankDiff !== 0;

        expect(isHorizontal || isVertical || isDiagonal).toBe(true);
      }
    });

    it('should combine rook and bishop movement patterns', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: queen } = createEmptyBoardWithPiece(
        Queen,
        PieceColor.WHITE,
        position,
      );

      const moves = queen.getMovementMoves(emptyBoard);

      const horizontalMoves = generateHorizontalPositions(position);
      const verticalMoves = generateVerticalPositions(position);

      expect(hasAllExpectedMoves(moves, horizontalMoves)).toBe(true);
      expect(hasAllExpectedMoves(moves, verticalMoves)).toBe(true);

      const diagonalMoves = [
        new Position(5, 5),
        new Position(6, 6),
        new Position(7, 7),
        new Position(3, 3),
        new Position(2, 2),
        new Position(1, 1),
        new Position(0, 0),
        new Position(5, 3),
        new Position(6, 2),
        new Position(7, 1),
        new Position(3, 5),
        new Position(2, 6),
        new Position(1, 7),
      ];

      expect(hasAllExpectedMoves(moves, diagonalMoves)).toBe(true);
    });
  });
});
