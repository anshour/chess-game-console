import { describe, it, expect, beforeEach } from 'vitest';
import { Bishop } from '../../../src/core/pieces/bishop';
import { Board } from '../../../src/core/board';
import { Position } from '../../../src/core/position';
import { PieceColor, PieceType } from '../../../src/utils/enums';
import { Pawn } from '../../../src/core/pieces/pawn';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  removePieceAt,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
} from '../../test-helpers';

describe('Bishop', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white bishop with correct properties', () => {
      const position = new Position(0, 2);
      const bishop = new Bishop(PieceColor.WHITE, position);

      expect(bishop.color).toBe(PieceColor.WHITE);
      expect(bishop.type).toBe(PieceType.BISHOP);
      expect(bishop.position.equals(position)).toBe(true);
      expect(bishop.hasMoved).toBe(false);
    });

    it('should create a black bishop with correct properties', () => {
      const position = new Position(7, 2);
      const bishop = new Bishop(PieceColor.BLACK, position);

      expect(bishop.color).toBe(PieceColor.BLACK);
      expect(bishop.type).toBe(PieceType.BISHOP);
      expect(bishop.position.equals(position)).toBe(true);
      expect(bishop.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should move diagonally on empty board', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = bishop.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(13);

      const expectedMoves = [
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

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(6, 6));
      placePieceAt(emptyBoard, friendlyPawn, new Position(6, 6));

      const moves = bishop.getMovementMoves(emptyBoard);

      const forbiddenMoves = [new Position(6, 6), new Position(7, 7)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moveExists(moves, new Position(5, 5))).toBe(true);
    });

    it('should stop at enemy pieces but not include them in movement moves', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(6, 6));
      placePieceAt(emptyBoard, enemyPawn, new Position(6, 6));

      const moves = bishop.getMovementMoves(emptyBoard);

      const forbiddenMoves = [new Position(6, 6), new Position(7, 7)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moveExists(moves, new Position(5, 5))).toBe(true);
    });

    it('should have no movement moves from starting position due to blocked path', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;
      const moves = bishop.getMovementMoves(board);

      expect(moves).toHaveLength(0);
    });

    it('should have moves when path is cleared', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;

      removePieceAt(board, new Position(1, 1));
      removePieceAt(board, new Position(1, 3));

      const moves = bishop.getMovementMoves(board);

      const expectedMoves = [
        new Position(1, 1),
        new Position(1, 3),
        new Position(2, 0),
        new Position(2, 4),
      ];

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });
  });

  describe('getAttackMoves', () => {
    it('should include squares with enemy pieces', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn1 = new Pawn(PieceColor.BLACK, new Position(6, 6));
      const enemyPawn2 = new Pawn(PieceColor.BLACK, new Position(2, 2));
      placePieceAt(emptyBoard, enemyPawn1, new Position(6, 6));
      placePieceAt(emptyBoard, enemyPawn2, new Position(2, 2));

      const moves = bishop.getAttackMoves(emptyBoard);

      const expectedAttacks = [new Position(6, 6), new Position(2, 2)];

      expect(hasAllExpectedMoves(moves, expectedAttacks)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn1 = new Pawn(PieceColor.WHITE, new Position(6, 6));
      const friendlyPawn2 = new Pawn(PieceColor.WHITE, new Position(2, 2));
      placePieceAt(emptyBoard, friendlyPawn1, new Position(6, 6));
      placePieceAt(emptyBoard, friendlyPawn2, new Position(2, 2));

      const moves = bishop.getAttackMoves(emptyBoard);

      const forbiddenMoves = [new Position(6, 6), new Position(2, 2)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
    });

    it('should not include empty squares', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = bishop.getAttackMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });

  describe('getLegalMoves', () => {
    it('should combine movement and attack moves', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(6, 6));
      placePieceAt(emptyBoard, enemyPawn, new Position(6, 6));

      const allMoves = bishop.getLegalMoves(emptyBoard);

      const expectedMoves = [
        new Position(5, 5),
        new Position(6, 6),
        new Position(3, 3),
        new Position(2, 2),
      ];

      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid diagonal movement', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;

      removePieceAt(board, new Position(1, 1));
      removePieceAt(board, new Position(1, 3));

      expect(bishop.isLegalMove(new Position(1, 1), board)).toBe(true);
      expect(bishop.isLegalMove(new Position(1, 3), board)).toBe(true);
    });

    it('should return true for valid attack move', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;

      removePieceAt(board, new Position(1, 1));
      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(2, 0));
      placePieceAt(board, enemyPawn, new Position(2, 0));

      expect(bishop.isLegalMove(new Position(2, 0), board)).toBe(true);
    });

    it('should return false for invalid horizontal move', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;
      removePieceAt(board, new Position(0, 1));

      expect(bishop.isLegalMove(new Position(0, 1), board)).toBe(false);
    });

    it('should return false for invalid vertical move', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;
      removePieceAt(board, new Position(1, 2));

      expect(bishop.isLegalMove(new Position(1, 2), board)).toBe(false);
    });

    it('should return false for invalid knight-like move', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;
      expect(bishop.isLegalMove(new Position(2, 1), board)).toBe(false);
    });

    it('should return false for blocked path', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;

      expect(bishop.isLegalMove(new Position(2, 0), board)).toBe(false);
      expect(bishop.isLegalMove(new Position(2, 4), board)).toBe(false);
    });

    it('should return false for move to square with friendly piece', () => {
      const bishop = board.getPieceAt(new Position(0, 2)) as Bishop;

      removePieceAt(board, new Position(1, 1));
      expect(bishop.isLegalMove(new Position(1, 1), board)).toBe(true);

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(2, 0));
      placePieceAt(board, friendlyPawn, new Position(2, 0));
      expect(bishop.isLegalMove(new Position(2, 0), board)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle bishop at board edges', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = bishop.getMovementMoves(emptyBoard);

      expect(moves.length).toBeGreaterThan(0);
      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);

      for (const move of moves) {
        expect(Math.abs(move.rankIndex - 0)).toBe(Math.abs(move.fileIndex - 0));
      }
    });

    it('should handle bishop at corner with only one diagonal available', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(7, 7),
      );

      const moves = bishop.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(7);
      const expectedMoves = [
        new Position(6, 6),
        new Position(5, 5),
        new Position(4, 4),
        new Position(3, 3),
        new Position(2, 2),
        new Position(1, 1),
        new Position(0, 0),
      ];

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should handle bishop surrounded by pieces', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const surroundingPieces = [
        new Position(3, 3),
        new Position(3, 5),
        new Position(5, 3),
        new Position(5, 5),
      ];

      surroundingPieces.forEach((pos) => {
        const pawn = new Pawn(PieceColor.WHITE, pos);
        placePieceAt(emptyBoard, pawn, pos);
      });

      const moves = bishop.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });

    it('should only move diagonally, never horizontally or vertically', () => {
      const { board: emptyBoard, piece: bishop } = createEmptyBoardWithPiece(
        Bishop,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = bishop.getMovementMoves(emptyBoard);

      for (const move of moves) {
        const rankDiff = Math.abs(move.rankIndex - 4);
        const fileDiff = Math.abs(move.fileIndex - 4);
        expect(rankDiff).toBe(fileDiff);
        expect(rankDiff).toBeGreaterThan(0);
      }

      expect(
        moves.some((move) => move.rankIndex === 4 && move.fileIndex !== 4),
      ).toBe(false);
      expect(
        moves.some((move) => move.fileIndex === 4 && move.rankIndex !== 4),
      ).toBe(false);
    });
  });
});
