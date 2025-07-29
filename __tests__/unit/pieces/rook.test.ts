import { describe, it, expect, beforeEach } from 'vitest';
import { Rook } from '../../../src/core/pieces/rook.js';
import { Board } from '../../../src/core/board.js';
import { Position } from '../../../src/core/position.js';
import { PieceColor, PieceType } from '../../../src/utils/enums.js';
import { Pawn } from '../../../src/core/pieces/pawn.js';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  removePieceAt,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
  generateHorizontalPositions,
  generateVerticalPositions,
} from '../../test-helpers.js';

describe('Rook', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white rook with correct properties', () => {
      const position = new Position(0, 0);
      const rook = new Rook(PieceColor.WHITE, position);

      expect(rook.color).toBe(PieceColor.WHITE);
      expect(rook.type).toBe(PieceType.ROOK);
      expect(rook.position.equals(position)).toBe(true);
      expect(rook.hasMoved).toBe(false);
    });

    it('should create a black rook with correct properties', () => {
      const position = new Position(7, 0);
      const rook = new Rook(PieceColor.BLACK, position);

      expect(rook.color).toBe(PieceColor.BLACK);
      expect(rook.type).toBe(PieceType.ROOK);
      expect(rook.position.equals(position)).toBe(true);
      expect(rook.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should move horizontally and vertically on empty board', () => {
      const position = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        position,
      );

      const moves = rook.getMovementMoves(emptyBoard);
      const expectedHorizontalMoves = generateHorizontalPositions(position);
      const expectedVerticalMoves = generateVerticalPositions(position);
      const allExpectedMoves = [
        ...expectedHorizontalMoves,
        ...expectedVerticalMoves,
      ];

      expect(moves).toHaveLength(14);
      expect(hasAllExpectedMoves(moves, allExpectedMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(4, 6));
      placePieceAt(emptyBoard, friendlyPawn, new Position(4, 6));

      const moves = rook.getMovementMoves(emptyBoard);
      const forbiddenMoves = [new Position(4, 6), new Position(4, 7)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moveExists(moves, new Position(4, 5))).toBe(true);
    });

    it('should stop at enemy pieces but not include them in movement moves', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(4, 6));
      placePieceAt(emptyBoard, enemyPawn, new Position(4, 6));

      const moves = rook.getMovementMoves(emptyBoard);
      const forbiddenMoves = [new Position(4, 6), new Position(4, 7)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moveExists(moves, new Position(4, 5))).toBe(true);
    });

    it('should have no movement moves from starting position due to blocked path', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;
      const moves = rook.getMovementMoves(board);

      expect(moves).toHaveLength(0);
    });

    it('should have moves when path is cleared', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;
      removePieceAt(board, new Position(1, 0));

      const moves = rook.getMovementMoves(board);
      const expectedMoves = [
        new Position(1, 0),
        new Position(2, 0),
        new Position(3, 0),
        new Position(4, 0),
        new Position(5, 0),
      ];

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
      expect(moveExists(moves, new Position(6, 0))).toBe(false);
    });
  });

  describe('getAttackMoves', () => {
    it('should include squares with enemy pieces', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const enemyPawn1 = new Pawn(PieceColor.BLACK, new Position(4, 6));
      const enemyPawn2 = new Pawn(PieceColor.BLACK, new Position(2, 4));
      placePieceAt(emptyBoard, enemyPawn1, new Position(4, 6));
      placePieceAt(emptyBoard, enemyPawn2, new Position(2, 4));

      const moves = rook.getAttackMoves(emptyBoard);
      const expectedAttackMoves = [new Position(4, 6), new Position(2, 4)];

      expect(hasAllExpectedMoves(moves, expectedAttackMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const friendlyPawn1 = new Pawn(PieceColor.WHITE, new Position(4, 6));
      const friendlyPawn2 = new Pawn(PieceColor.WHITE, new Position(2, 4));
      placePieceAt(emptyBoard, friendlyPawn1, new Position(4, 6));
      placePieceAt(emptyBoard, friendlyPawn2, new Position(2, 4));

      const moves = rook.getAttackMoves(emptyBoard);
      const forbiddenMoves = [new Position(4, 6), new Position(2, 4)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
    });

    it('should not include empty squares', () => {
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = rook.getAttackMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });

  describe('getLegalMoves', () => {
    it('should combine movement and attack moves', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(4, 6));
      placePieceAt(emptyBoard, enemyPawn, new Position(4, 6));

      const allMoves = rook.getLegalMoves(emptyBoard);
      const expectedMoves = [
        new Position(4, 5),
        new Position(4, 6),
        new Position(3, 4),
        new Position(5, 4),
      ];

      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid horizontal movement', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;

      for (let file = 1; file < 8; file++) {
        removePieceAt(board, new Position(0, file));
      }

      expect(rook.isLegalMove(new Position(0, 1), board)).toBe(true);
      expect(rook.isLegalMove(new Position(0, 7), board)).toBe(true);
    });

    it('should return true for valid vertical movement', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;
      removePieceAt(board, new Position(1, 0));

      expect(rook.isLegalMove(new Position(1, 0), board)).toBe(true);
      expect(rook.isLegalMove(new Position(2, 0), board)).toBe(true);
    });

    it('should return true for valid attack move', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;

      removePieceAt(board, new Position(0, 1));
      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(0, 2));
      placePieceAt(board, enemyPawn, new Position(0, 2));

      expect(rook.isLegalMove(new Position(0, 2), board)).toBe(true);
    });

    it('should return false for invalid diagonal move', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;
      removePieceAt(board, new Position(1, 1));

      expect(rook.isLegalMove(new Position(1, 1), board)).toBe(false);
    });

    it('should return false for invalid knight-like move', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;
      expect(rook.isLegalMove(new Position(2, 1), board)).toBe(false);
    });

    it('should return false for blocked path', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;

      expect(rook.isLegalMove(new Position(2, 0), board)).toBe(false);
    });

    it('should return false for move to square with friendly piece', () => {
      const rook = board.getPieceAt(new Position(0, 0)) as Rook;

      expect(rook.isLegalMove(new Position(0, 1), board)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle rook at board edges', () => {
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = rook.getMovementMoves(emptyBoard);

      expect(moves.length).toBeGreaterThan(0);
      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);
    });

    it('should handle rook surrounded by pieces', () => {
      const rookPosition = new Position(4, 4);
      const { board: emptyBoard, piece: rook } = createEmptyBoardWithPiece(
        Rook,
        PieceColor.WHITE,
        rookPosition,
      );

      const surroundingPositions = [
        new Position(4, 3),
        new Position(4, 5),
        new Position(3, 4),
        new Position(5, 4),
      ];

      surroundingPositions.forEach((pos) => {
        const pawn = new Pawn(PieceColor.WHITE, pos);
        placePieceAt(emptyBoard, pawn, pos);
      });

      const moves = rook.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });
});
