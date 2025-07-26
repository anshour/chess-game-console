import { Position } from '../core/position.js';

export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black',
}

export enum PieceType {
  PAWN = 'P',
  ROOK = 'R',
  KNIGHT = 'N',
  BISHOP = 'B',
  QUEEN = 'Q',
  KING = 'K',
}

export enum GameStatus {
  PLAYING = 'playing',
  WHITE_WINS = 'white_wins',
  BLACK_WINS = 'black_wins',
  DRAW = 'draw',
  STOP = 'stop',
}

export interface Move {
  from: Position;
  to: Position;
}
