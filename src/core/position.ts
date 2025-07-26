export class Position {
  constructor(
    public readonly rankIndex: number, // 0-7 (1-8 in notation)
    public readonly fileIndex: number, // 0-7 (a-h in notation)
  ) {
    this.validate(rankIndex, fileIndex);
  }

  validate(rankIndex: number, fileIndex: number): void {
    if (isNaN(rankIndex) || isNaN(fileIndex)) {
      throw new Error('Rank and file indices must be numbers');
    }

    if (rankIndex < 0 || rankIndex > 7) {
      throw new Error('Rank index must be between 0 and 7 or 1-8 in notation');
    }
    if (fileIndex < 0 || fileIndex > 7) {
      throw new Error('File index must be between 0 and 7 or a-h in notation');
    }
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

  static fromAlgebraic(notation: string): Position {
    if (notation.length !== 2) {
      throw new Error('Invalid notation format');
    }

    const fileChar = notation[0].toLowerCase();

    const file = fileChar.charCodeAt(0) - 97; // 'a' = 97
    const rank = parseInt(notation[1], 10) - 1;

    return new Position(rank, file);
  }

  static fromNumeric(notation: string): Position {
    if (notation.length !== 3) {
      throw new Error('Invalid notation format');
    }

    const file = parseInt(notation[0], 10) - 1;
    const rank = parseInt(notation[2], 10) - 1;

    return new Position(rank, file);
  }

  static parse(input: string): Position {
    const firstChar = input[0].toLowerCase();

    if (isNaN(parseInt(firstChar))) {
      return Position.fromAlgebraic(input);
    } else {
      return Position.fromNumeric(input);
    }
  }
}
