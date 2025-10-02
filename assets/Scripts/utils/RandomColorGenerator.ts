import { SeededRandom } from "./SeededRandom";

type RandomColorGeneratorType = {
  numberColors: number;
  seed?: number;
};

export class RandomColorGenerator {
  private count: number;
  private random: SeededRandom;

  constructor({ numberColors, seed = 1 }: RandomColorGeneratorType) {
    this.count = numberColors;
    this.random = new SeededRandom(seed);
  }

  // Генерация одного случайного цвета в формате [R, G, B]
  public generateRandomColors(): number[][] {
    const colors: number[][] = [];

    for (let i = 0; i < this.count; i++) {
      const r = this.random.range(0, 256);
      const g = this.random.range(0, 256);
      const b = this.random.range(0, 256);
      colors.push([r, g, b]);
    }

    return colors;
  }
}
