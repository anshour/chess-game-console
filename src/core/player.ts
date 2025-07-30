import { PieceColor } from '../utils/enums';

export class Player {
  public readonly color: PieceColor;
  public readonly name: string;

  constructor(color: PieceColor, name: string) {
    this.color = color;
    this.name = name;
  }
}
