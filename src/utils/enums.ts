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

export enum MoveStatus {
  SUCCESS = 'success',
  INVALID = 'invalid',
  PROMOTION = 'promotion',
  KING_CAPTURED = 'king_captured',

  // TODO: IMPLEMENT
  // STALEMATE = 'stalemate',
  // CHECK = 'check',
  // CHECKMATE = 'checkmate',
}

export enum GameStatus {
  PLAYING = 'playing',
  WHITE_WINS = 'white_wins',
  BLACK_WINS = 'black_wins',

  // TODO: IMPLEMENT
  // DRAW = 'draw',
  // STOP = 'stop',
}
