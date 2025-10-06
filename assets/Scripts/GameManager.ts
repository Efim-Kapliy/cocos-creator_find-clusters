import { _decorator, CCInteger, Component, director, Prefab } from "cc";
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
  private _seedRandom: seedType = 27;

  public fieldMatrix: number[][] = [];

  protected onLoad() {}

  protected start(): void {
    if (!this.blockPrefab) {
      console.error("Block prefab is not set!");
    }

    this.rerender();
  }

  private rerender(): void {
    director.emit("game-manager-update");
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
