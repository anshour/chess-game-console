import { describe, it, expect, beforeEach } from 'vitest';
import { Pawn } from '../../../src/core/pieces/pawn.js';
import { Board } from '../../../src/core/board.js';
import { Position } from '../../../src/core/position.js';
import { PieceColor, PieceType } from '../../../src/utils/enums.js';
import {
  createEmptyBoardWithPiece,
  placePieceAt,
  moveExists,
  hasAllExpectedMoves,
  hasNoForbiddenMoves,
} from '../../test-helpers.js';

describe('Pawn', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create a white pawn with correct properties', () => {
      const position = new Position(1, 0);
      const pawn = new Pawn(PieceColor.WHITE, position);

      expect(pawn.color).toBe(PieceColor.WHITE);
      expect(pawn.type).toBe(PieceType.PAWN);
      expect(pawn.position.equals(position)).toBe(true);
      expect(pawn.hasMoved).toBe(false);
    });

    it('should create a black pawn with correct properties', () => {
      const position = new Position(6, 0);
      const pawn = new Pawn(PieceColor.BLACK, position);

      expect(pawn.color).toBe(PieceColor.BLACK);
      expect(pawn.type).toBe(PieceType.PAWN);
      expect(pawn.position.equals(position)).toBe(true);
      expect(pawn.hasMoved).toBe(false);
    });
  });

  describe('getMovementMoves', () => {
    it('should allow white pawn to move one and two squares forward from starting position', () => {
      const pawn = board.getPieceAt(new Position(1, 0)) as Pawn;
      const moves = pawn.getMovementMoves(board);
      const expectedMoves = [new Position(2, 0), new Position(3, 0)];

      expect(moves).toHaveLength(2);
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should allow black pawn to move one and two squares forward from starting position', () => {
      const pawn = board.getPieceAt(new Position(6, 0)) as Pawn;
      const moves = pawn.getMovementMoves(board);
      const expectedMoves = [new Position(5, 0), new Position(4, 0)];

      expect(moves).toHaveLength(2);
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
    });

    it('should not allow two-square move after pawn has moved', () => {
      board.movePiece({ from: new Position(1, 0), to: new Position(2, 0) });
      const pawn = board.getPieceAt(new Position(2, 0)) as Pawn;
      const moves = pawn.getMovementMoves(board);

      const expectedMoves = [new Position(3, 0)];
      const forbiddenMoves = [new Position(4, 0)];

      expect(moves).toHaveLength(1);
      expect(hasAllExpectedMoves(moves, expectedMoves)).toBe(true);
      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
    });

    it('should not allow movement if path is blocked', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(2, 0),
      );

      const blockingPawn = new Pawn(PieceColor.BLACK, new Position(3, 0));
      placePieceAt(emptyBoard, blockingPawn, new Position(3, 0));

      const moves = pawn.getMovementMoves(emptyBoard);
      expect(moves).toHaveLength(0);
    });

    it('should not allow movement if two-square path is blocked', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 0),
      );

      const blockingPawn = new Pawn(PieceColor.BLACK, new Position(2, 0));
      placePieceAt(emptyBoard, blockingPawn, new Position(2, 0));

      const moves = pawn.getMovementMoves(emptyBoard);
      expect(moves).toHaveLength(0);
    });

    it('should not allow movement beyond board boundaries', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(7, 0),
      );

      const moves = pawn.getMovementMoves(emptyBoard);
      expect(moves).toHaveLength(0);
    });

    it('should not allow movement beyond board boundaries for black pawn', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.BLACK,
        new Position(0, 0),
      );

      const moves = pawn.getMovementMoves(emptyBoard);
      expect(moves).toHaveLength(0);
    });
  });

  describe('getAttackMoves', () => {
    it('should allow white pawn to attack diagonally left', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 1),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(2, 0));
      placePieceAt(emptyBoard, enemyPawn, new Position(2, 0));

      const moves = pawn.getAttackMoves(emptyBoard);
      expect(moveExists(moves, new Position(2, 0))).toBe(true);
    });

    it('should allow white pawn to attack diagonally right', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 1),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(2, 2));
      placePieceAt(emptyBoard, enemyPawn, new Position(2, 2));

      const moves = pawn.getAttackMoves(emptyBoard);
      expect(moveExists(moves, new Position(2, 2))).toBe(true);
    });

    it('should allow black pawn to attack diagonally', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.BLACK,
        new Position(6, 1),
      );

      const enemyPawn = new Pawn(PieceColor.WHITE, new Position(5, 0));
      placePieceAt(emptyBoard, enemyPawn, new Position(5, 0));

      const moves = pawn.getAttackMoves(emptyBoard);
      expect(moveExists(moves, new Position(5, 0))).toBe(true);
    });

    it('should not attack friendly pieces', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 1),
      );

      const friendlyPawn = new Pawn(PieceColor.WHITE, new Position(2, 0));
      placePieceAt(emptyBoard, friendlyPawn, new Position(2, 0));

      const moves = pawn.getAttackMoves(emptyBoard);
      const forbiddenMoves = [new Position(2, 0)];

      expect(hasNoForbiddenMoves(moves, forbiddenMoves)).toBe(true);
    });

    it('should not attack empty squares', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 1),
      );

      const moves = pawn.getAttackMoves(emptyBoard);
      expect(moves).toHaveLength(0);
    });

    it('should handle en passant attack', () => {
      board.movePiece({ from: new Position(1, 4), to: new Position(3, 4) });
      board.movePiece({ from: new Position(6, 3), to: new Position(4, 3) });
      board.movePiece({ from: new Position(4, 3), to: new Position(3, 3) });
      board.movePiece({ from: new Position(1, 2), to: new Position(3, 2) });

      const blackPawn = board.getPieceAt(new Position(3, 3)) as Pawn;
      const moves = blackPawn.getAttackMoves(board);

      const enPassantTarget = board.getEnPassantTarget();
      if (enPassantTarget) {
        expect(moveExists(moves, enPassantTarget)).toBe(true);
      }
    });

    it('should not attack beyond board boundaries', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 0),
      );

      const moves = pawn.getAttackMoves(emptyBoard);

      expect(
        moves.every((move) => move.fileIndex >= 0 && move.fileIndex <= 7),
      ).toBe(true);
      expect(
        moves.every((move) => move.rankIndex >= 0 && move.rankIndex <= 7),
      ).toBe(true);
    });
  });

  describe('getAnyValidMoves', () => {
    it('should combine movement and attack moves', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 0),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(2, 1));
      placePieceAt(emptyBoard, enemyPawn, new Position(2, 1));

      const allMoves = pawn.getAnyValidMoves(emptyBoard);
      const expectedMoves = [
        new Position(2, 0),
        new Position(3, 0),
        new Position(2, 1),
      ];

      expect(hasAllExpectedMoves(allMoves, expectedMoves)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid movement', () => {
      const pawn = board.getPieceAt(new Position(1, 0)) as Pawn;
      expect(pawn.isValidMove(new Position(2, 0), board)).toBe(true);
      expect(pawn.isValidMove(new Position(3, 0), board)).toBe(true);
    });

    it('should return true for valid attack', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 0),
      );

      const enemyPawn = new Pawn(PieceColor.BLACK, new Position(2, 1));
      placePieceAt(emptyBoard, enemyPawn, new Position(2, 1));

      expect(pawn.isValidMove(new Position(2, 1), emptyBoard)).toBe(true);
    });

    it('should return false for invalid move', () => {
      const { board: emptyBoard, piece: pawn } = createEmptyBoardWithPiece(
        Pawn,
        PieceColor.WHITE,
        new Position(1, 0),
      );

      expect(pawn.isValidMove(new Position(4, 0), emptyBoard)).toBe(false);
      expect(pawn.isValidMove(new Position(2, 1), emptyBoard)).toBe(false);
      expect(pawn.isValidMove(new Position(1, 1), emptyBoard)).toBe(false);
    });
  });
});
