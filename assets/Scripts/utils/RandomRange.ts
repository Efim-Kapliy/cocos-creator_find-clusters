export class RandomRange {
  constructor(
    private min: number,
    private max: number,
    private inclusive: boolean = true
  ) {
    if (min >= max) {
      throw new Error("Минимальное значение должно быть меньше максимального");
    }
  }

  /**
   * Возвращает случайное число в диапазоне [min, max] или [min, max)
   */
  getRandom(): number {
    if (this.inclusive) {
      return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    } else {
      return Math.random() * (this.max - this.min) + this.min;
    }
  }

  /**
   * Возвращает случайное целое число в диапазоне [min, max] или [min, max)
   */
  getRandomInt(): number {
    if (this.inclusive) {
      return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    } else {
      return Math.floor(Math.random() * (this.max - this.min)) + this.min;
    }
  }
}
