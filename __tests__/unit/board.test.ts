import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '../../src/core/board.js';
import { Position } from '../../src/core/position.js';
import { PieceColor, PieceType } from '../../src/utils/enums.js';
import { Pawn } from '../../src/core/pieces/pawn.js';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('initialization', () => {
    it('should initialize an 8x8 board with pieces in correct starting positions', () => {
      expect(board.getPieceAt(new Position(0, 0))?.type).toBe(PieceType.ROOK);
      expect(board.getPieceAt(new Position(0, 1))?.type).toBe(PieceType.KNIGHT);
      expect(board.getPieceAt(new Position(0, 2))?.type).toBe(PieceType.BISHOP);
      expect(board.getPieceAt(new Position(0, 3))?.type).toBe(PieceType.QUEEN);
      expect(board.getPieceAt(new Position(0, 4))?.type).toBe(PieceType.KING);
      expect(board.getPieceAt(new Position(0, 5))?.type).toBe(PieceType.BISHOP);
      expect(board.getPieceAt(new Position(0, 6))?.type).toBe(PieceType.KNIGHT);
      expect(board.getPieceAt(new Position(0, 7))?.type).toBe(PieceType.ROOK);

      for (let file = 0; file < 8; file++) {
        const pawn = board.getPieceAt(new Position(1, file));
        expect(pawn?.type).toBe(PieceType.PAWN);
        expect(pawn?.color).toBe(PieceColor.WHITE);
      }

      expect(board.getPieceAt(new Position(7, 0))?.type).toBe(PieceType.ROOK);
      expect(board.getPieceAt(new Position(7, 1))?.type).toBe(PieceType.KNIGHT);
      expect(board.getPieceAt(new Position(7, 2))?.type).toBe(PieceType.BISHOP);
      expect(board.getPieceAt(new Position(7, 3))?.type).toBe(PieceType.QUEEN);
      expect(board.getPieceAt(new Position(7, 4))?.type).toBe(PieceType.KING);
      expect(board.getPieceAt(new Position(7, 5))?.type).toBe(PieceType.BISHOP);
      expect(board.getPieceAt(new Position(7, 6))?.type).toBe(PieceType.KNIGHT);
      expect(board.getPieceAt(new Position(7, 7))?.type).toBe(PieceType.ROOK);

      for (let file = 0; file < 8; file++) {
        const pawn = board.getPieceAt(new Position(6, file));
        expect(pawn?.type).toBe(PieceType.PAWN);
        expect(pawn?.color).toBe(PieceColor.BLACK);
      }

      for (let rank = 2; rank < 6; rank++) {
        for (let file = 0; file < 8; file++) {
          expect(board.getPieceAt(new Position(rank, file))).toBeNull();
        }
      }
    });

    it('should have all white pieces colored white', () => {
      for (let file = 0; file < 8; file++) {
        expect(board.getPieceAt(new Position(0, file))?.color).toBe(
          PieceColor.WHITE,
        );
        expect(board.getPieceAt(new Position(1, file))?.color).toBe(
          PieceColor.WHITE,
        );
      }
    });

    it('should have all black pieces colored black', () => {
      for (let file = 0; file < 8; file++) {
        expect(board.getPieceAt(new Position(6, file))?.color).toBe(
          PieceColor.BLACK,
        );
        expect(board.getPieceAt(new Position(7, file))?.color).toBe(
          PieceColor.BLACK,
        );
      }
    });
  });

  describe('getPieceAt', () => {
    it('should return correct piece at given position', () => {
      const piece = board.getPieceAt(new Position(0, 0));
      expect(piece?.type).toBe(PieceType.ROOK);
      expect(piece?.color).toBe(PieceColor.WHITE);
    });

    it('should return null for empty squares', () => {
      expect(board.getPieceAt(new Position(3, 3))).toBeNull();
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid pawn move', () => {
      const from = new Position(1, 0);
      const to = new Position(2, 0);
      expect(board.isValidMove({ from, to })).toBe(true);
    });

    it('should return true for valid two-step pawn move', () => {
      const from = new Position(1, 0);
      const to = new Position(3, 0);
      expect(board.isValidMove({ from, to })).toBe(true);
    });

    it('should return false for invalid move', () => {
      const from = new Position(1, 0);
      const to = new Position(4, 0);
      expect(board.isValidMove({ from, to })).toBe(false);
    });

    it('should return false when no piece at from position', () => {
      const from = new Position(3, 3);
      const to = new Position(4, 3);
      expect(board.isValidMove({ from, to })).toBe(false);
    });
  });

  describe('movePiece', () => {
    it('should successfully move a piece', () => {
      const from = new Position(1, 0);
      const to = new Position(2, 0);

      const piece = board.getPieceAt(from);
      expect(piece).toBeTruthy();

      const result = board.movePiece({ from, to });
      expect(result).toBe(true);

      expect(board.getPieceAt(from)).toBeNull();
      expect(board.getPieceAt(to)).toBe(piece);
      expect(piece?.position.equals(to)).toBe(true);
      expect(piece?.hasMoved).toBe(true);
    });

    it('should throw error for invalid move', () => {
      const from = new Position(1, 0);
      const to = new Position(4, 0);

      expect(() => board.movePiece({ from, to })).toThrow(
        'Invalid move! Please check the piece and target position.',
      );
    });

    it('should capture enemy piece', () => {
      board.movePiece({ from: new Position(1, 4), to: new Position(2, 4) });
      board.movePiece({ from: new Position(2, 4), to: new Position(3, 4) });
      board.movePiece({ from: new Position(3, 4), to: new Position(4, 4) });

      board.movePiece({ from: new Position(6, 5), to: new Position(5, 5) });

      const result = board.movePiece({
        from: new Position(4, 4),
        to: new Position(5, 5),
      });

      expect(result).toBe(true);
      expect(board.getPieceAt(new Position(5, 5))?.color).toBe(
        PieceColor.WHITE,
      );

      const capturedPieces = board.getCapturedPieces();
      expect(capturedPieces.black).toContain(PieceType.PAWN);
    });

    it('should set en passant target for two-step pawn move', () => {
      board.movePiece({ from: new Position(1, 0), to: new Position(3, 0) });
      const enPassantTarget = board.getEnPassantTarget();
      expect(enPassantTarget?.equals(new Position(2, 0))).toBe(true);
    });

    it('should clear en passant target after non-two-step move', () => {
      board.movePiece({ from: new Position(1, 0), to: new Position(3, 0) });
      expect(board.getEnPassantTarget()).toBeTruthy();

      board.movePiece({ from: new Position(1, 1), to: new Position(2, 1) });
      expect(board.getEnPassantTarget()).toBeNull();
    });
  });

  describe('areCoordinatesWithinBoard', () => {
    it('should return true for valid coordinates', () => {
      expect(board.areCoordinatesWithinBoard(0, 0)).toBe(true);
      expect(board.areCoordinatesWithinBoard(7, 7)).toBe(true);
      expect(board.areCoordinatesWithinBoard(3, 3)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(board.areCoordinatesWithinBoard(-1, 0)).toBe(false);
      expect(board.areCoordinatesWithinBoard(0, -1)).toBe(false);
      expect(board.areCoordinatesWithinBoard(8, 0)).toBe(false);
      expect(board.areCoordinatesWithinBoard(0, 8)).toBe(false);
      expect(board.areCoordinatesWithinBoard(8, 8)).toBe(false);
    });
  });

  describe('isSquareAttacked', () => {
    it('should detect square attacked by pawn', () => {
      board.movePiece({ from: new Position(1, 1), to: new Position(2, 1) });
      board.movePiece({ from: new Position(2, 1), to: new Position(3, 1) });
      board.movePiece({ from: new Position(3, 1), to: new Position(4, 1) });
      board.movePiece({ from: new Position(4, 1), to: new Position(5, 1) });

      const isAttacked = board.isSquareAttacked(
        new Position(5, 1),
        PieceColor.BLACK,
      );
      expect(isAttacked).toBe(true);
    });

    it('should return false for unattacked square', () => {
      const isAttacked = board.isSquareAttacked(
        new Position(3, 3),
        PieceColor.BLACK,
      );
      expect(isAttacked).toBe(false);
    });
  });

  describe('isKingInCheck', () => {
    it('should return false for king not in check at start', () => {
      expect(board.isKingInCheck(PieceColor.WHITE)).toBe(false);
      expect(board.isKingInCheck(PieceColor.BLACK)).toBe(false);
    });
  });

  describe('pawn promotion', () => {
    it('should detect when pawn can be promoted', () => {
      const whitePawn = new Pawn(PieceColor.WHITE, new Position(7, 0));
      expect(board.canBePromoted(whitePawn)).toBe(true);

      const blackPawn = new Pawn(PieceColor.BLACK, new Position(0, 0));
      expect(board.canBePromoted(blackPawn)).toBe(true);
    });

    it('should detect when pawn cannot be promoted', () => {
      const pawn = board.getPieceAt(new Position(1, 0));
      expect(board.canBePromoted(pawn!)).toBe(false);
    });

    it('should not allow promotion of non-pawn pieces', () => {
      const rook = board.getPieceAt(new Position(0, 0));
      expect(board.canBePromoted(rook!)).toBe(false);
    });
  });

  describe('getCapturedPieces', () => {
    it('should return empty arrays initially', () => {
      const captured = board.getCapturedPieces();
      expect(captured.white).toEqual([]);
      expect(captured.black).toEqual([]);
    });

    it('should track multiple captured pieces correctly', () => {
      board.movePiece({ from: new Position(1, 4), to: new Position(2, 4) });
      board.movePiece({ from: new Position(2, 4), to: new Position(3, 4) });
      board.movePiece({ from: new Position(3, 4), to: new Position(4, 4) });
      board.movePiece({ from: new Position(4, 4), to: new Position(5, 4) });

      board.movePiece({ from: new Position(5, 4), to: new Position(6, 5) });

      let captured = board.getCapturedPieces();
      expect(captured.black).toContain(PieceType.PAWN);
      expect(captured.black).toHaveLength(1);
      expect(captured.white).toHaveLength(0);

      board.movePiece({ from: new Position(7, 1), to: new Position(5, 2) });
      board.movePiece({ from: new Position(5, 2), to: new Position(3, 1) });
      board.movePiece({ from: new Position(3, 1), to: new Position(1, 0) });

      captured = board.getCapturedPieces();
      expect(captured.black).toContain(PieceType.PAWN);
      expect(captured.white).toContain(PieceType.PAWN);
      expect(captured.black).toHaveLength(1);
      expect(captured.white).toHaveLength(1);
    });

    it('should track captured pieces by color correctly', () => {
      board.movePiece({ from: new Position(1, 4), to: new Position(2, 4) });
      board.movePiece({ from: new Position(2, 4), to: new Position(3, 4) });
      board.movePiece({ from: new Position(3, 4), to: new Position(4, 4) });
      board.movePiece({ from: new Position(4, 4), to: new Position(5, 4) });
      board.movePiece({ from: new Position(5, 4), to: new Position(6, 5) });

      board.movePiece({ from: new Position(7, 1), to: new Position(5, 2) });
      board.movePiece({ from: new Position(5, 2), to: new Position(3, 1) });
      board.movePiece({ from: new Position(3, 1), to: new Position(1, 0) });

      const captured = board.getCapturedPieces();
      expect(captured.black).toContain(PieceType.PAWN);
      expect(captured.white).toContain(PieceType.PAWN);
      expect(captured.black).toHaveLength(1);
      expect(captured.white).toHaveLength(1);
    });
  });

  describe('getCapturedKing', () => {
    it('should return null initially', () => {
      expect(board.getCapturedKing()).toBeNull();
    });

    it('should return captured king when king is captured', () => {
      board.movePiece({ from: new Position(0, 1), to: new Position(2, 2) });
      board.movePiece({ from: new Position(2, 2), to: new Position(4, 3) });
      board.movePiece({ from: new Position(4, 3), to: new Position(6, 2) });

      board.movePiece({ from: new Position(6, 2), to: new Position(7, 4) });

      const capturedKing = board.getCapturedKing();
      expect(capturedKing).not.toBeNull();
      expect(capturedKing?.type).toBe(PieceType.KING);
      expect(capturedKing?.color).toBe(PieceColor.BLACK);
    });

    it('should remain null when non-king pieces are captured', () => {
      board.movePiece({ from: new Position(1, 4), to: new Position(2, 4) });
      board.movePiece({ from: new Position(2, 4), to: new Position(3, 4) });
      board.movePiece({ from: new Position(3, 4), to: new Position(4, 4) });
      board.movePiece({ from: new Position(4, 4), to: new Position(5, 4) });

      board.movePiece({ from: new Position(5, 4), to: new Position(6, 5) });

      expect(board.getCapturedKing()).toBeNull();
    });
  });

  describe('getEnPassantTarget', () => {
    it('should return null initially', () => {
      expect(board.getEnPassantTarget()).toBeNull();
    });

    it('should set en passant target for black pawn two-step move', () => {
      board.movePiece({ from: new Position(6, 3), to: new Position(4, 3) });
      const enPassantTarget = board.getEnPassantTarget();
      expect(enPassantTarget?.equals(new Position(5, 3))).toBe(true);
    });

    it('should clear en passant target after any non-pawn move', () => {
      board.movePiece({ from: new Position(1, 0), to: new Position(3, 0) });
      expect(board.getEnPassantTarget()).toBeTruthy();

      board.movePiece({ from: new Position(0, 1), to: new Position(2, 2) });
      expect(board.getEnPassantTarget()).toBeNull();
    });

    it('should not set en passant target for single-step pawn moves', () => {
      board.movePiece({ from: new Position(1, 2), to: new Position(2, 2) });
      expect(board.getEnPassantTarget()).toBeNull();

      board.movePiece({ from: new Position(6, 7), to: new Position(5, 7) });
      expect(board.getEnPassantTarget()).toBeNull();
    });

    it('should update en passant target when multiple two-step moves are made', () => {
      board.movePiece({ from: new Position(1, 0), to: new Position(3, 0) });
      let enPassantTarget = board.getEnPassantTarget();
      expect(enPassantTarget?.equals(new Position(2, 0))).toBe(true);

      board.movePiece({ from: new Position(6, 7), to: new Position(4, 7) });
      enPassantTarget = board.getEnPassantTarget();
      expect(enPassantTarget?.equals(new Position(5, 7))).toBe(true);
    });

    it('should clear en passant target after pawn promotion move', () => {
      board.movePiece({ from: new Position(1, 1), to: new Position(3, 1) });
      expect(board.getEnPassantTarget()).toBeTruthy();

      board.movePiece({ from: new Position(6, 0), to: new Position(5, 0) });
      expect(board.getEnPassantTarget()).toBeNull();
    });
  });
});
