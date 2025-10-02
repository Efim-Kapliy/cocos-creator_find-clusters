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
} from "cc";
import { ClusterFinderDFS, SeededRandom } from "./utils";
import { BlockFactory } from "./blocks";
import { RandomColorGenerator } from "./utils/RandomColorGenerator";
import { EDITOR } from "cc/env";
const { ccclass, property, executeInEditMode } = _decorator;

type AddScoreType = {
  M: number;
  N: number;
  Y: number;
  X: number;
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
    const random = new SeededRandom(12);

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

  public addScore({ M, N, X, Y }: AddScoreType): void {
    this._m = M;
    this._n = N;
    this._x = X;
    this._y = Y;

    this.rerender();
  }
}
