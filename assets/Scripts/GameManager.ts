import {
  _decorator,
  CCInteger,
  Color,
  Component,
  director,
  EventTarget,
  instantiate,
  Node,
  Prefab,
  Sprite,
  Toggle,
} from "cc";
import { ClusterFinderDFS, SeededRandom } from "./utils";
import { BlockFactory } from "./blocks";
import { RandomColorGenerator } from "./utils/RandomColorGenerator";
import { EDITOR } from "cc/env";
const { ccclass, property, executeInEditMode } = _decorator;

type AddScoreType = {
  m: number;
  n: number;
  y: number;
  x: number;
  seed: number;
  checkboxSeed: boolean;
};

/**
 * @ru
 * Массив чисел, представляющий размеры блока [x, y], где x - его ширина, а y - высота.
 * @example
 * ```ts
 * const BLOCK_SIZE: number[] = [40, 40];
 * ```
 *  */
export const BLOCK_SIZE: number[] = [40, 40];

@ccclass("GameManager")
@executeInEditMode
export class GameManager extends Component {
  @property({ type: CCInteger, serializable: true })
  public mp: number;

  @property({ type: CCInteger })
  get M(): number {
    return this._m;
  }
  set M(value: number) {
    if (this._m === value) return;

    this._m = value;
    this.rerender();
  }

  @property({ type: CCInteger })
  get N(): number {
    return this._n;
  }
  set N(value: number) {
    if (this._n === value) return;

    this._n = value;
    this.rerender();
  }

  @property({ type: CCInteger })
  get X(): number {
    return this._x;
  }
  set X(value: number) {
    if (this._x === value) return;

    this._x = value;
    this.rerender();
  }

  @property({ type: CCInteger })
  get Y(): number {
    return this._y;
  }
  set Y(value: number) {
    if (this._y === value) return;

    this._y = value;
    this.rerender();
  }

  @property({ type: CCInteger })
  get SeedRandom(): number {
    return this._seedRandom;
  }
  set SeedRandom(value: number) {
    if (this._seedRandom === value) return;

    this._seedRandom = value;
    this.rerender();
  }

  /**
   * @ru
   * Статичный сид
   *  */
  @property({ type: Boolean })
  public checkboxSeed: boolean = false;

  /**
   * @ru
   * Префаб блока
   *  */
  @property({ type: Prefab })
  public blockPrefab: Prefab | null = null;

  /**
   * @ru
   * Ширина поля блоков
   *  */
  private _m: number = 7;

  /**
   * @ru
   * Высота поля блоков
   *  */
  private _n: number = 8;

  /**
   * @ru
   * Кол-во цветовых схем для блоков
   *  */
  private _x: number = 5;

  /**
   * @ru
   * Минимальный размер искомого кластера
   *  */
  private _y: number = 3;

  /**
   * @ru
   * Сид рандома
   *  */
  private _seedRandom: number = 3;

  public fieldMatrix: number[][] = [];
  private _mapLength: number = this._m * this._n;
  public blockForColorTypesMatrix: number[][] = [];

  protected onLoad() {}

  protected start(): void {
    if (!this.blockPrefab) {
      console.error("Block prefab is not set!");
    }

    this.rerender();
  }

  private rerender(): void {
    this._mapLength = this._m * this._n;
    this.generateBlocksForColorTypes();
    this.generateMap();
    director.emit("game-manager-update");
  }

  private generateMap(): void {
    this.node.removeAllChildren();
    this.fieldMatrix = [];
    const random = new SeededRandom(this._seedRandom);

    // генерация матрицы последовательности блоков
    let lineMatrix: number[] = [];
    for (let i = 1; i <= this._mapLength; i++) {
      lineMatrix.push(random.range(0, this._x - 1));

      if (i % this._m == 0) {
        this.fieldMatrix.push(lineMatrix);
        lineMatrix = [];
      }
    }

    // размещение блоков на сцене
    for (let y = 0; y < this.fieldMatrix.length; y++) {
      // создание блоков по линии в матрице
      for (let x = 0; x < this.fieldMatrix[y].length; x++) {
        const colorType = this.fieldMatrix[y][x];
        const colorRGB = this.blockForColorTypesMatrix[colorType];

        BlockFactory.createBlock({
          blockType: "simple",
          colorRGB: colorRGB,
          parent: this.node,
          positionX: x * BLOCK_SIZE[0],
          positionY: y * BLOCK_SIZE[1],
          prefab: this.blockPrefab,
        });
      }
    }
  }

  private generateBlocksForColorTypes(): void {
    if (!this._x || this._x === 0) return;
    this.blockForColorTypesMatrix = [];

    const colorScheme = new RandomColorGenerator({
      numberColors: this._x,
    }).generateRandomColors();
    for (let i = 0; i < colorScheme.length; i++) {
      this.blockForColorTypesMatrix.push(colorScheme[i]);
    }
  }

  public addScore({ m, n, x, y, seed, checkboxSeed }: AddScoreType): void {
    this._m = m;
    this._n = n;
    this._x = x;
    this._y = y;
    this._seedRandom = seed;
    this.checkboxSeed = checkboxSeed;
    this.rerender();
  }
}
