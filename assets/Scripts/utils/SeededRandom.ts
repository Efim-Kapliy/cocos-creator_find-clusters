export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Линейный конгруэнтный генератор (LCG)
  private next(): number {
    this.seed = (1664525 * this.seed + 1013904223) % 4294967296;
    return this.seed / 4294967296; // Нормализация к [0, 1)
  }

  // Случайное число в диапазоне [min, max]
  public range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
