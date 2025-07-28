import { describe, it, expect, beforeEach } from 'vitest';
import { Knight } from '../../../src/core/pieces/knight.js';
import { Board } from '../../../src/core/board.js';
import { Position } from '../../../src/core/position.js';
import { PieceColor, PieceType } from '../../../src/utils/enums.js';
import { Pawn } from '../../../src/core/pieces/pawn.js';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
} from '../../test-helpers.js';

describe('Knight', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white knight with correct properties', () => {
      const position = new Position(0, 1);
      const knight = new Knight(PieceColor.WHITE, position);

      expect(knight.color).toBe(PieceColor.WHITE);
      expect(knight.type).toBe(PieceType.KNIGHT);
      expect(knight.position.equals(position)).toBe(true);
      expect(knight.hasMoved).toBe(false);
    });

    it('should create a black knight with correct properties', () => {
      const position = new Position(7, 1);
      const knight = new Knight(PieceColor.BLACK, position);

      expect(knight.color).toBe(PieceColor.BLACK);
      expect(knight.type).toBe(PieceType.KNIGHT);
      expect(knight.position.equals(position)).toBe(true);
      expect(knight.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should move in L-shapes on empty board', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = knight.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(8);

      const expectedMoves = [
        new Position(6, 5),
        new Position(6, 3),
        new Position(2, 5),
        new Position(2, 3),
        new Position(5, 6),
        new Position(5, 2),
        new Position(3, 6),
        new Position(3, 2),
      ];

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(6, 5));
      placePieceAt(emptyBoard, friendlyPawn, new Position(6, 5));

      const moves = knight.getMovementMoves(emptyBoard);

      expect(moveExists(moves, new Position(6, 5))).toBe(false);

      expect(moves).toHaveLength(7);
    });

    it('should not include squares with enemy pieces in movement moves', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(6, 5));
      placePieceAt(emptyBoard, enemyPawn, new Position(6, 5));

      const moves = knight.getMovementMoves(emptyBoard);

      expect(moveExists(moves, new Position(6, 5))).toBe(false);

      expect(moves).toHaveLength(7);
    });

    it('should have limited moves from starting position', () => {
      const knight = board.getPieceAt(new Position(0, 1)) as Knight;
      const moves = knight.getMovementMoves(board);

      expect(moves).toHaveLength(2);
      const expectedMoves = [new Position(2, 0), new Position(2, 2)];
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should handle knight at board edges', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = knight.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(2);
      const expectedMoves = [new Position(2, 1), new Position(1, 2)];
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);

      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);
    });
  });

  describe('getAttackMoves', () => {
    it('should include squares with enemy pieces', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn1 = new Pawn(PieceColor.BLACK, new Position(6, 5));
      const enemyPawn2 = new Pawn(PieceColor.BLACK, new Position(2, 3));
      placePieceAt(emptyBoard, enemyPawn1, new Position(6, 5));
      placePieceAt(emptyBoard, enemyPawn2, new Position(2, 3));

      const moves = knight.getAttackMoves(emptyBoard);

      const expectedMoves = [new Position(6, 5), new Position(2, 3)];
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
      expect(moves).toHaveLength(2);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn1 = new Pawn(PieceColor.WHITE, new Position(6, 5));
      const friendlyPawn2 = new Pawn(PieceColor.WHITE, new Position(2, 3));
      placePieceAt(emptyBoard, friendlyPawn1, new Position(6, 5));
      placePieceAt(emptyBoard, friendlyPawn2, new Position(2, 3));

      const moves = knight.getAttackMoves(emptyBoard);

      const forbiddenMoves = [new Position(6, 5), new Position(2, 3)];
      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moves).toHaveLength(0);
    });

    it('should not include empty squares', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = knight.getAttackMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });

  describe('getAnyValidMoves', () => {
    it('should combine movement and attack moves', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(6, 5));
      placePieceAt(emptyBoard, enemyPawn, new Position(6, 5));

      const allMoves = knight.getAnyValidMoves(emptyBoard);

      const expectedMoves = [
        new Position(6, 3),
        new Position(6, 5),
        new Position(2, 3),
        new Position(2, 5),
      ];
      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
      expect(allMoves).toHaveLength(8);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid L-shaped movement', () => {
      const knight = board.getPieceAt(new Position(0, 1)) as Knight;

      expect(knight.isValidMove(new Position(2, 0), board)).toBe(true);
      expect(knight.isValidMove(new Position(2, 2), board)).toBe(true);
    });

    it('should return true for valid attack move', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(6, 5));
      placePieceAt(emptyBoard, enemyPawn, new Position(6, 5));

      expect(knight.isValidMove(new Position(6, 5), emptyBoard)).toBe(true);
    });

    it('should return false for invalid non-L-shaped moves', () => {
      const knight = board.getPieceAt(new Position(0, 1)) as Knight;

      expect(knight.isValidMove(new Position(1, 1), board)).toBe(false);
      expect(knight.isValidMove(new Position(0, 2), board)).toBe(false);
      expect(knight.isValidMove(new Position(1, 1), board)).toBe(false);
      expect(knight.isValidMove(new Position(3, 1), board)).toBe(false);
    });

    it('should return false for moves to squares with friendly pieces', () => {
      const knight = board.getPieceAt(new Position(0, 1)) as Knight;

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(2, 0));
      placePieceAt(board, friendlyPawn, new Position(2, 0));

      expect(knight.isValidMove(new Position(2, 0), board)).toBe(false);
    });

    it('should return false for moves outside board boundaries', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = knight.getAnyValidMoves(emptyBoard);

      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);

      expect(moves).toHaveLength(2);
      const expectedMoves = [new Position(2, 1), new Position(1, 2)];
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle knight at all board corners', () => {
      const corners = [
        new Position(0, 0),
        new Position(0, 7),
        new Position(7, 0),
        new Position(7, 7),
      ];

      for (const corner of corners) {
        const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
          Knight,
          PieceColor.WHITE,
          corner,
        );

        const moves = knight.getMovementMoves(emptyBoard);

        expect(moves).toHaveLength(2);

        expect(
          moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
        ).toBe(true);
        expect(
          moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
        ).toBe(true);
      }
    });

    it('should handle knight at board edges', () => {
      const edgePositions = [
        new Position(0, 3),
        new Position(7, 3),
        new Position(3, 0),
        new Position(3, 7),
      ];

      for (const edgePos of edgePositions) {
        const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
          Knight,
          PieceColor.WHITE,
          edgePos,
        );

        const moves = knight.getMovementMoves(emptyBoard);

        expect(moves.length).toBeGreaterThan(2);
        expect(moves.length).toBeLessThan(8);

        expect(
          moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
        ).toBe(true);
        expect(
          moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
        ).toBe(true);
      }
    });

    it('should jump over pieces (knight property)', () => {
      const { board: emptyBoard, piece: knight } = createEmptyBoardWithPiece(
        Knight,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const surroundingPositions = [
        new Position(3, 4),
        new Position(5, 4),
        new Position(4, 3),
        new Position(4, 5),
        new Position(3, 3),
        new Position(3, 5),
        new Position(5, 3),
        new Position(5, 5),
      ];

      surroundingPositions.forEach((pos) => {
        const pawn = new Pawn(PieceColor.BLACK, pos);
        placePieceAt(emptyBoard, pawn, pos);
      });

      const moves = knight.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(8);
      const expectedMoves = [
        new Position(6, 5),
        new Position(6, 3),
        new Position(2, 5),
        new Position(2, 3),
        new Position(5, 6),
        new Position(5, 2),
        new Position(3, 6),
        new Position(3, 2),
      ];
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });
  });
});
