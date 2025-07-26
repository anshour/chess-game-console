export class Position {
  constructor(
    public readonly rankIndex: number, // 0-7 (1-8 in notation)
    public readonly fileIndex: number, // 0-7 (a-h in notation)
  ) {
    if (!Position.isValidPosition(this.rankIndex, this.fileIndex)) {
      throw new Error(
        'Invalid position: rank and file indices must be between 0-7',
      );
    }
  }

  // validate(rankIndex: number, fileIndex: number): void {
  //   if (isNaN(rankIndex) || isNaN(fileIndex)) {
  //     throw new Error('Rank and file indices must be numbers');
  //   }

  //   if (rankIndex < 0 || rankIndex > 7) {
  //     throw new Error('Rank index must be between 0 and 7 or 1-8 in notation');
  //   }
  //   if (fileIndex < 0 || fileIndex > 7) {
  //     throw new Error('File index must be between 0 and 7 or a-h in notation');
  //   }
  // }

  static isValidPosition(rank: number, file: number): boolean {
    return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
  }

  static isValidAlgebraic(notation: string): boolean {
    if (notation.length !== 2) return false;

    const file = notation[0].toLowerCase().charCodeAt(0) - 97;
    const rank = parseInt(notation[1], 10) - 1;

    if (isNaN(file) || isNaN(rank)) return false;

    return this.isValidPosition(rank, file);
  }

  static isValidNumeric(notation: string): boolean {
    if (notation.length !== 3) return false;

    const file = parseInt(notation[0], 10) - 1;
    const rank = parseInt(notation[2], 10) - 1;

    if (isNaN(file) || isNaN(rank)) return false;

    return this.isValidPosition(rank, file);
  }

  equals(other: Position): boolean {
    return (
      this.fileIndex === other.fileIndex && this.rankIndex === other.rankIndex
    );
  }

  toAlgebraic(): string {
    const fileChar = String.fromCharCode(97 + this.fileIndex); // 'a' + file
    const rankChar = (this.rankIndex + 1).toString();

    return `${fileChar}${rankChar}`;
  }

  private static fromAlgebraic(notation: string): Position {
    const fileChar = notation[0].toLowerCase();

    const file = fileChar.charCodeAt(0) - 97; // 'a' = 97
    const rank = parseInt(notation[1], 10) - 1;

    return new Position(rank, file);
  }

  private static fromNumeric(notation: string): Position {
    const file = parseInt(notation[0], 10) - 1;
    const rank = parseInt(notation[2], 10) - 1;

    return new Position(rank, file);
  }

  static parse(input: string): Position | null {
    const isAlgebraic = this.isValidAlgebraic(input);
    if (isAlgebraic) {
      return this.fromAlgebraic(input);
    }

    const isNumeric = this.isValidNumeric(input);

    if (isNumeric) {
      return this.fromNumeric(input);
    }

    return null;
  }
}
