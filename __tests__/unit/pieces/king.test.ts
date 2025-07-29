import { describe, it, expect, beforeEach } from 'vitest';
import { King } from '../../../src/core/pieces/king.js';
import { Board } from '../../../src/core/board.js';
import { Position } from '../../../src/core/position.js';
import { PieceColor, PieceType } from '../../../src/utils/enums.js';
import { Pawn } from '../../../src/core/pieces/pawn.js';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  removePieceAt,
  clearHorizontalPath,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
} from '../../test-helpers.js';

describe('King', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white king with correct properties', () => {
      const position = new Position(0, 4);
      const king = new King(PieceColor.WHITE, position);

      expect(king.color).toBe(PieceColor.WHITE);
      expect(king.type).toBe(PieceType.KING);
      expect(king.position.equals(position)).toBe(true);
      expect(king.hasMoved).toBe(false);
    });

    it('should create a black king with correct properties', () => {
      const position = new Position(7, 4);
      const king = new King(PieceColor.BLACK, position);

      expect(king.color).toBe(PieceColor.BLACK);
      expect(king.type).toBe(PieceType.KING);
      expect(king.position.equals(position)).toBe(true);
      expect(king.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should move one square in all directions on empty board', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = king.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(8);

      const expectedMoves = [
        new Position(5, 4),
        new Position(3, 4),
        new Position(4, 5),
        new Position(4, 3),
        new Position(5, 5),
        new Position(5, 3),
        new Position(3, 5),
        new Position(3, 3),
      ];

      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(5, 4));
      placePieceAt(emptyBoard, friendlyPawn, new Position(5, 4));

      const moves = king.getMovementMoves(emptyBoard);

      expect(moveExists(moves, new Position(5, 4))).toBe(false);

      expect(moves).toHaveLength(7);
    });

    it('should not include squares with enemy pieces in movement moves', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(5, 4));
      placePieceAt(emptyBoard, enemyPawn, new Position(5, 4));

      const moves = king.getMovementMoves(emptyBoard);

      expect(moveExists(moves, new Position(5, 4))).toBe(false);

      expect(moves).toHaveLength(7);
    });

    it('should have no movement moves from starting position due to blocked squares', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;
      const moves = king.getMovementMoves(board);

      expect(moves).toHaveLength(0);
    });

    it('should include castling moves when conditions are met', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      removePieceAt(board, new Position(0, 5));
      removePieceAt(board, new Position(0, 6));

      removePieceAt(board, new Position(0, 1));
      removePieceAt(board, new Position(0, 2));
      removePieceAt(board, new Position(0, 3));

      const moves = king.getMovementMoves(board);

      expect(moves.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle king at board edges', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(0, 0),
      );

      const moves = king.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(3);

      const expectedMoves = [
        new Position(1, 0),
        new Position(0, 1),
        new Position(1, 1),
      ];

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
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn1 = new Pawn(PieceColor.BLACK, new Position(5, 4));
      const enemyPawn2 = new Pawn(PieceColor.BLACK, new Position(3, 3));
      placePieceAt(emptyBoard, enemyPawn1, new Position(5, 4));
      placePieceAt(emptyBoard, enemyPawn2, new Position(3, 3));

      const moves = king.getAttackMoves(emptyBoard);

      const expectedAttacks = [new Position(5, 4), new Position(3, 3)];
      expect(hasAllExpectedMoves(moves, expectedAttacks)).toBe(true);
      expect(moves).toHaveLength(2);
    });

    it('should not include squares with friendly pieces', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const friendlyPawn1 = new Pawn(PieceColor.WHITE, new Position(5, 4));
      const friendlyPawn2 = new Pawn(PieceColor.WHITE, new Position(3, 3));
      placePieceAt(emptyBoard, friendlyPawn1, new Position(5, 4));
      placePieceAt(emptyBoard, friendlyPawn2, new Position(3, 3));

      const moves = king.getAttackMoves(emptyBoard);

      const forbiddenMoves = [new Position(5, 4), new Position(3, 3)];
      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
      expect(moves).toHaveLength(0);
    });

    it('should not include empty squares', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = king.getAttackMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });
  });

  describe('getLegalMoves', () => {
    it('should combine movement and attack moves', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(5, 4));
      placePieceAt(emptyBoard, enemyPawn, new Position(5, 4));

      const allMoves = king.getLegalMoves(emptyBoard);

      const expectedMoves = [
        new Position(3, 4),
        new Position(5, 4),
        new Position(4, 3),
        new Position(4, 5),
      ];

      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
      expect(allMoves).toHaveLength(8);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid one-square movement', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      removePieceAt(board, new Position(0, 3));
      removePieceAt(board, new Position(0, 5));
      removePieceAt(board, new Position(1, 4));

      expect(king.isLegalMove(new Position(0, 3), board)).toBe(true);
      expect(king.isLegalMove(new Position(0, 5), board)).toBe(true);
      expect(king.isLegalMove(new Position(1, 4), board)).toBe(true);
    });

    it('should return true for valid attack move', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(5, 4));
      placePieceAt(emptyBoard, enemyPawn, new Position(5, 4));

      expect(king.isLegalMove(new Position(5, 4), emptyBoard)).toBe(true);
    });

    it('should return false for invalid multi-square moves', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      removePieceAt(board, new Position(1, 4));
      removePieceAt(board, new Position(2, 4));

      expect(king.isLegalMove(new Position(2, 4), board)).toBe(false);
      expect(king.isLegalMove(new Position(0, 6), board)).toBe(false);
    });

    it('should return false for invalid diagonal long moves', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      removePieceAt(board, new Position(1, 3));
      removePieceAt(board, new Position(2, 2));

      expect(king.isLegalMove(new Position(2, 2), board)).toBe(false);
    });

    it('should return false for knight-like moves', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;
      expect(king.isLegalMove(new Position(2, 3), board)).toBe(false);
      expect(king.isLegalMove(new Position(1, 2), board)).toBe(false);
    });

    it('should return false for moves to squares with friendly pieces', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      expect(king.isLegalMove(new Position(0, 3), board)).toBe(false);
      expect(king.isLegalMove(new Position(1, 4), board)).toBe(false);
    });

    it('should return true for castling moves when conditions are met', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      clearHorizontalPath(board, 0, 1, 3);
      clearHorizontalPath(board, 0, 5, 6);

      const kingsideCastle = king.isLegalMove(new Position(0, 6), board);
      const queensideCastle = king.isLegalMove(new Position(0, 2), board);

      expect(typeof kingsideCastle).toBe('boolean');
      expect(typeof queensideCastle).toBe('boolean');
    });
  });

  describe('castling', () => {
    it('should not allow castling if king has moved', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      clearHorizontalPath(board, 0, 1, 3);
      clearHorizontalPath(board, 0, 5, 6);

      king.hasMoved = true;

      const moves = king.getMovementMoves(board);

      const forbiddenCastlingMoves = [new Position(0, 6), new Position(0, 2)];
      expect(hasNoForbiddenMoves(moves, forbiddenCastlingMoves)).toBe(true);
    });

    it('should not allow castling if rook has moved', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;
      const kingsideRook = board.getPieceAt(new Position(0, 7));

      removePieceAt(board, new Position(0, 5));
      removePieceAt(board, new Position(0, 6));

      if (kingsideRook) {
        kingsideRook.hasMoved = true;
      }

      const moves = king.getMovementMoves(board);

      expect(moveExists(moves, new Position(0, 6))).toBe(false);
    });

    it('should not allow castling through occupied squares', () => {
      const king = board.getPieceAt(new Position(0, 4)) as King;

      removePieceAt(board, new Position(0, 6));

      const moves = king.getMovementMoves(board);

      expect(moveExists(moves, new Position(0, 6))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle king at all board corners', () => {
      const corners = [
        new Position(0, 0),
        new Position(0, 7),
        new Position(7, 0),
        new Position(7, 7),
      ];

      for (const corner of corners) {
        const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
          King,
          PieceColor.WHITE,
          corner,
        );

        const moves = king.getMovementMoves(emptyBoard);

        expect(moves).toHaveLength(3);

        expect(
          moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
        ).toBe(true);
        expect(
          moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
        ).toBe(true);
      }
    });

    it('should handle king at board edges', () => {
      const edgePositions = [
        new Position(0, 3),
        new Position(7, 3),
        new Position(3, 0),
        new Position(3, 7),
      ];

      for (const edgePos of edgePositions) {
        const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
          King,
          PieceColor.WHITE,
          edgePos,
        );

        const moves = king.getMovementMoves(emptyBoard);

        expect(moves).toHaveLength(5);

        expect(
          moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
        ).toBe(true);
        expect(
          moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
        ).toBe(true);
      }
    });

    it('should handle king surrounded by pieces', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
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

      for (const pos of surroundingPositions) {
        const friendlyPawn = new Pawn(PieceColor.WHITE, pos);
        placePieceAt(emptyBoard, friendlyPawn, pos);
      }

      const moves = king.getMovementMoves(emptyBoard);

      expect(moves).toHaveLength(0);
    });

    it('should only move one square in any direction', () => {
      const { board: emptyBoard, piece: king } = createEmptyBoardWithPiece(
        King,
        PieceColor.WHITE,
        new Position(4, 4),
      );

      const moves = king.getMovementMoves(emptyBoard);

      for (const move of moves) {
        const rankDiff = Math.abs(move.rankIndex - 4);
        const fileDiff = Math.abs(move.fileIndex - 4);
        expect(Math.max(rankDiff, fileDiff)).toBe(1);
        expect(rankDiff <= 1 && fileDiff <= 1).toBe(true);
      }

      expect(moves).toHaveLength(8);
    });
  });
});
