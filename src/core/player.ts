import { PieceColor } from '../utils/enums.js';

export class Player {
  public readonly color: PieceColor;
  public readonly name: string;

  constructor(color: PieceColor, name: string) {
    this.color = color;
    this.name = name.trim();

    if (!this.name) {
      throw new Error('Player name cannot be empty');
    }
  }

  public toString(): string {
    return this.name;
  }

  public getDisplayName(): string {
    return `${this.name} (${this.color === PieceColor.WHITE ? 'White' : 'Black'})`;
  }
}
