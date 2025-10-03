import {
  _decorator,
  CCBoolean,
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
import { BlockFactory } from "./Blocks";
import {
  checkboxSeedType,
  mType,
  nType,
  seedType,
  yType,
} from "./types/gameManagerTypes";
const { ccclass, property, executeInEditMode } = _decorator;

type AddScoreType = {
  m: mType;
  n: nType;
  y: yType;
  seed: seedType;
  checkboxSeed: checkboxSeedType;
};

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
  @property
  public checkboxSeed: checkboxSeedType = false;

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
  private _m: mType = 7;

  /**
   * @ru
   * Высота поля блоков
   *  */
  private _n: nType = 8;

  /**
   * @ru
   * Минимальный размер искомого кластера
   *  */
  private _y: yType = 3;

  /**
   * @ru
   * Сид рандома
   *  */
  private _seedRandom: seedType = 3;

  public fieldMatrix: number[][] = [];
  private _mapLength: number = this._m * this._n;

  protected onLoad() {}

  protected start(): void {
    if (!this.blockPrefab) {
      console.error("Block prefab is not set!");
    }

    this.rerender();
  }

  private rerender(): void {
    this._mapLength = this._m * this._n;
    // this.generateMap();
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
        const symbolId = this.fieldMatrix[y][x];

        BlockFactory.createBlock({
          blockType: "simple",
          colorRGB: symbolId,
          parent: this.node,
          positionX: x * BLOCK_SIZE[0],
          positionY: y * BLOCK_SIZE[1],
          prefab: this.blockPrefab,
        });
      }
    }
  }

  public addScore({ m, n, y, seed, checkboxSeed }: AddScoreType): void {
    this._m = m;
    this._n = n;
    this._y = y;
    this._seedRandom = seed;
    this.checkboxSeed = checkboxSeed;
    this.rerender();
  }
}
