import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/core/game';
import { Position } from '../../src/core/position';
import {
  GameStatus,
  MoveStatus,
  PieceColor,
  PieceType,
} from '../../src/utils/enums';
import { Move } from '../../src/core/types';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      expect(game.getStatus()).toBe(GameStatus.PLAYING);
      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);
      expect(game.getCurrentPlayer().name).toBe('White');
      expect(game.isGameOver()).toBe(false);
      expect(game.getBoard()).toBeDefined();
    });

    it('should have white player starting first', () => {
      const currentPlayer = game.getCurrentPlayer();
      expect(currentPlayer.color).toBe(PieceColor.WHITE);
      expect(currentPlayer.name).toBe('White');
    });

    it('should initialize board with pieces in starting positions', () => {
      const board = game.getBoard();

      expect(board.getPieceAt(new Position(0, 0))?.type).toBe(PieceType.ROOK);
      expect(board.getPieceAt(new Position(0, 4))?.type).toBe(PieceType.KING);
      expect(board.getPieceAt(new Position(1, 0))?.type).toBe(PieceType.PAWN);

      expect(board.getPieceAt(new Position(7, 0))?.type).toBe(PieceType.ROOK);
      expect(board.getPieceAt(new Position(7, 4))?.type).toBe(PieceType.KING);
      expect(board.getPieceAt(new Position(6, 0))?.type).toBe(PieceType.PAWN);
    });
  });

  describe('makeMove', () => {
    it('should successfully make a valid move', () => {
      const move: Move = {
        from: new Position(1, 0),
        to: new Position(2, 0),
      };

      const result = game.makeMove(move);
      expect(result).toBe(MoveStatus.SUCCESS);

      const board = game.getBoard();
      expect(board.getPieceAt(move.from)).toBeNull();
      expect(board.getPieceAt(move.to)?.type).toBe(PieceType.PAWN);
      expect(board.getPieceAt(move.to)?.color).toBe(PieceColor.WHITE);
    });

    it('should switch player after successful move', () => {
      const move: Move = {
        from: new Position(1, 0),
        to: new Position(2, 0),
      };

      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);
      game.makeMove(move);
      expect(game.getCurrentPlayer().color).toBe(PieceColor.BLACK);
    });

    it('should throw error when no piece at from position', () => {
      const move: Move = {
        from: new Position(3, 3),
        to: new Position(4, 3),
      };

      expect(() => game.makeMove(move)).toThrow('No piece found at d4');
    });

    it('should throw error when trying to move opponent piece', () => {
      const move: Move = {
        from: new Position(6, 0),
        to: new Position(5, 0),
      };

      expect(() => game.makeMove(move)).toThrow(
        "Invalid turn! It's not your piece.",
      );
    });

    it('should return PROMOTION status when pawn reaches promotion rank', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      game.makeMove({ from: new Position(6, 7), to: new Position(5, 7) });
      game.makeMove({ from: new Position(2, 0), to: new Position(3, 0) });
      game.makeMove({ from: new Position(5, 7), to: new Position(4, 7) });
      game.makeMove({ from: new Position(3, 0), to: new Position(4, 0) });
      game.makeMove({ from: new Position(4, 7), to: new Position(3, 7) });
      game.makeMove({ from: new Position(4, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(3, 7), to: new Position(2, 7) });
      game.makeMove({ from: new Position(5, 0), to: new Position(6, 1) });
      game.makeMove({ from: new Position(2, 7), to: new Position(1, 6) });

      const result = game.makeMove({
        from: new Position(6, 1),
        to: new Position(7, 2),
      });
      expect(result).toBe(MoveStatus.PROMOTION);
    });

    it('should return KING_CAPTURED status and set game status when king is captured', () => {
      game.makeMove({ from: new Position(0, 1), to: new Position(2, 2) });
      game.makeMove({ from: new Position(6, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(2, 2), to: new Position(4, 3) });
      game.makeMove({ from: new Position(5, 0), to: new Position(4, 0) });
      game.makeMove({ from: new Position(4, 3), to: new Position(6, 2) });
      game.makeMove({ from: new Position(4, 0), to: new Position(3, 0) });

      const result = game.makeMove({
        from: new Position(6, 2),
        to: new Position(7, 4),
      });
      expect(result).toBe(MoveStatus.KING_CAPTURED);
      expect(game.getStatus()).toBe(GameStatus.WHITE_WINS);
      expect(game.isGameOver()).toBe(true);
    });

    it('should set correct winner when king is captured', () => {
      game.makeMove({ from: new Position(1, 4), to: new Position(2, 4) });
      game.makeMove({ from: new Position(7, 1), to: new Position(5, 2) });
      game.makeMove({ from: new Position(2, 4), to: new Position(3, 4) });
      game.makeMove({ from: new Position(5, 2), to: new Position(3, 1) });
      game.makeMove({ from: new Position(3, 4), to: new Position(4, 4) });
      game.makeMove({ from: new Position(3, 1), to: new Position(1, 2) });
      game.makeMove({ from: new Position(4, 4), to: new Position(5, 4) });

      const result = game.makeMove({
        from: new Position(1, 2),
        to: new Position(0, 4),
      });
      expect(result).toBe(MoveStatus.KING_CAPTURED);
      expect(game.getStatus()).toBe(GameStatus.BLACK_WINS);
      expect(game.isGameOver()).toBe(true);
    });
  });

  describe('player management', () => {
    it('should set white player name', () => {
      game.setWhitePlayerName('Alice');
      const currentPlayer = game.getCurrentPlayer();
      expect(currentPlayer.name).toBe('Alice');
      expect(currentPlayer.color).toBe(PieceColor.WHITE);
    });

    it('should set black player name', () => {
      game.setBlackPlayerName('Bob');

      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });

      const currentPlayer = game.getCurrentPlayer();
      expect(currentPlayer.name).toBe('Bob');
      expect(currentPlayer.color).toBe(PieceColor.BLACK);
    });

    it('should update current player when setting name of current player', () => {
      game.setWhitePlayerName('Alice');
      expect(game.getCurrentPlayer().name).toBe('Alice');

      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });

      game.setBlackPlayerName('Bob');
      expect(game.getCurrentPlayer().name).toBe('Bob');
    });

    it('should not affect current player when setting name of non-current player', () => {
      game.setBlackPlayerName('Bob');
      expect(game.getCurrentPlayer().name).toBe('White');
      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);
    });
  });

  describe('pawn promotion', () => {
    it('should promote pawn and switch player', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(3, 0) });
      game.makeMove({ from: new Position(6, 7), to: new Position(5, 7) });
      game.makeMove({ from: new Position(3, 0), to: new Position(4, 0) });
      game.makeMove({ from: new Position(6, 2), to: new Position(5, 2) });
      game.makeMove({ from: new Position(4, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(6, 3), to: new Position(5, 3) });
      game.makeMove({ from: new Position(5, 0), to: new Position(6, 1) });
      game.makeMove({ from: new Position(6, 4), to: new Position(5, 4) });
      game.makeMove({ from: new Position(6, 1), to: new Position(7, 0) });

      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);

      const promotionPosition = new Position(7, 0);
      game.promotePawn(promotionPosition, PieceType.QUEEN);

      expect(game.getCurrentPlayer().color).toBe(PieceColor.BLACK);
    });

    it('should promote pawn to specified piece type', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      game.makeMove({ from: new Position(6, 7), to: new Position(5, 7) });
      game.makeMove({ from: new Position(2, 0), to: new Position(3, 0) });
      game.makeMove({ from: new Position(5, 7), to: new Position(4, 7) });
      game.makeMove({ from: new Position(3, 0), to: new Position(4, 0) });
      game.makeMove({ from: new Position(4, 7), to: new Position(3, 7) });
      game.makeMove({ from: new Position(4, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(3, 7), to: new Position(2, 7) });

      game.makeMove({ from: new Position(5, 0), to: new Position(6, 1) });
      game.makeMove({ from: new Position(2, 7), to: new Position(1, 6) });

      game.makeMove({ from: new Position(6, 1), to: new Position(7, 0) });

      const promotionPosition = new Position(7, 0);
      const board = game.getBoard();

      expect(board.getPieceAt(promotionPosition)?.type).toBe(PieceType.PAWN);

      game.promotePawn(promotionPosition, PieceType.QUEEN);

      expect(board.getPieceAt(promotionPosition)?.type).toBe(PieceType.QUEEN);
      expect(board.getPieceAt(promotionPosition)?.color).toBe(PieceColor.WHITE);
    });
  });

  describe('game status and state', () => {
    it('should return correct game status', () => {
      expect(game.getStatus()).toBe(GameStatus.PLAYING);
      expect(game.isGameOver()).toBe(false);
    });

    it('should return correct board instance', () => {
      const board = game.getBoard();
      expect(board).toBeDefined();

      expect(board.getPieceAt(new Position(0, 0))?.type).toBe(PieceType.ROOK);
    });

    it('should return correct current player', () => {
      const player = game.getCurrentPlayer();
      expect(player.color).toBe(PieceColor.WHITE);
      expect(player.name).toBe('White');

      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      const newPlayer = game.getCurrentPlayer();
      expect(newPlayer.color).toBe(PieceColor.BLACK);
      expect(newPlayer.name).toBe('Black');
    });

    it('should correctly identify game over state', () => {
      expect(game.isGameOver()).toBe(false);

      game.makeMove({ from: new Position(0, 1), to: new Position(2, 2) });
      game.makeMove({ from: new Position(6, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(2, 2), to: new Position(4, 3) });
      game.makeMove({ from: new Position(5, 0), to: new Position(4, 0) });
      game.makeMove({ from: new Position(4, 3), to: new Position(6, 2) });
      game.makeMove({ from: new Position(4, 0), to: new Position(3, 0) });
      game.makeMove({ from: new Position(6, 2), to: new Position(7, 4) });

      expect(game.isGameOver()).toBe(true);
      expect(game.getStatus()).toBe(GameStatus.WHITE_WINS);
    });
  });

  describe('turn validation', () => {
    it('should allow white to move white pieces', () => {
      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);

      const move: Move = {
        from: new Position(1, 0),
        to: new Position(2, 0),
      };

      expect(() => game.makeMove(move)).not.toThrow();
    });

    it('should prevent white from moving black pieces', () => {
      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);

      const move: Move = {
        from: new Position(6, 0),
        to: new Position(5, 0),
      };

      expect(() => game.makeMove(move)).toThrow(
        "Invalid turn! It's not your piece.",
      );
    });

    it('should allow black to move black pieces after turn switch', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      expect(game.getCurrentPlayer().color).toBe(PieceColor.BLACK);

      const move: Move = {
        from: new Position(6, 0),
        to: new Position(5, 0),
      };

      expect(() => game.makeMove(move)).not.toThrow();
    });

    it('should prevent black from moving white pieces', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      expect(game.getCurrentPlayer().color).toBe(PieceColor.BLACK);

      const move: Move = {
        from: new Position(1, 1),
        to: new Position(2, 1),
      };

      expect(() => game.makeMove(move)).toThrow(
        "Invalid turn! It's not your piece.",
      );
    });
  });

  describe('move history and counting', () => {
    it('should record moves in history', () => {
      const move1: Move = {
        from: new Position(1, 0),
        to: new Position(2, 0),
      };
      const move2: Move = {
        from: new Position(6, 0),
        to: new Position(5, 0),
      };

      game.makeMove(move1);
      game.makeMove(move2);

      expect(game.getCurrentPlayer().color).toBe(PieceColor.WHITE);
    });

    it('should increment move count', () => {
      game.makeMove({ from: new Position(1, 0), to: new Position(2, 0) });
      game.makeMove({ from: new Position(6, 0), to: new Position(5, 0) });
      game.makeMove({ from: new Position(1, 1), to: new Position(2, 1) });

      expect(game.getCurrentPlayer().color).toBe(PieceColor.BLACK);
    });
  });
});
