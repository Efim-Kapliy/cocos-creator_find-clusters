import { _decorator, Component, director, Node } from "cc";
import { GameManager } from "db://assets/Scripts/GameManager";
import { SymbolMapItem } from "../Symbols/SymbolMapItem";
import { SymbolMapContainer } from "../Symbols/SymbolMapContainer";
import {
  mType,
  seedType,
  xType,
  yType,
} from "db://assets/Scripts/types/gameManagerTypes";
import { ClusterFinderDFS, SeededRandom } from "db://assets/Scripts/utils";
import { BlockFactory } from "db://assets/Scripts/Blocks";
const { ccclass, property } = _decorator;

/**
 * @ru
 * Массив чисел, представляющий размеры блока [x, y], где x - его ширина, а y - высота.
 * @example
 * ```ts
 * const BLOCK_SIZE: number[] = [60, 60];
 * ```
 *  */
export const BLOCK_SIZE: number[] = [60, 60];

@ccclass("SlotContainer")
export class SlotContainer extends Component {
  @property({ type: GameManager })
  public gameManager: GameManager;

  private _symbolsMapContainer: SymbolMapItem[] = [];
  private _m: mType;
  private _amountColorScheme: xType;
  private _minClusterSize: yType;
  private _seedRandom: seedType;
  private _mapLength: number;
  private _fieldMatrix: number[][] = [];

  protected onLoad(): void {
    const container = this.getComponent(SymbolMapContainer);
    container.eventTarget.on(
      "symbol-map-changed",
      this.getSymbolMapContainer,
      this
    );
    director.on("game-manager-update", this.listenGameManager, this);
  }

  protected onDestroy(): void {
    const container = this.getComponent(SymbolMapContainer);
    container.eventTarget.off(
      "symbol-map-changed",
      this.getSymbolMapContainer,
      this
    );
    director.off("game-manager-update", this.listenGameManager, this);
  }

  rerender(): void {
    this.positioningSymbolsOnSlot();
  }

  private listenGameManager(): void {
    if (!this.gameManager) return;

    this._minClusterSize = this.gameManager?.Y;
    this._seedRandom = this.gameManager?.SeedRandom;
    this._mapLength = this.gameManager?.M * this.gameManager?.N;

    this.rerender();
  }

  private getSymbolMapContainer(map: SymbolMapItem[]): void {
    this._symbolsMapContainer = map;
  }

  // генерация матрицы последовательности блоков
  private generationOfSymbolSequenceMatrix(): void {
    const random = new SeededRandom(this._seedRandom);
    let lineMatrix: number[] = [];
    for (let i = 1; i <= this._mapLength; i++) {
      lineMatrix.push(random.range(0, this._amountColorScheme - 1));

      if (i % this._m == 0) {
        this._fieldMatrix.push(lineMatrix);
        lineMatrix = [];
      }
    }
  }

  private positioningSymbolsOnSlot(): void {
    this._fieldMatrix = [];

    if (this._symbolsMapContainer.length === 0) {
      console.error("Symbols map container is empty!");
      return;
    }
    if (!this.gameManager) return;
    this.node.removeAllChildren();

    // размещение блоков на сцене
    this._minClusterSize = this.gameManager?.Y;
    const clustersMap = this.searchCluster();

    if (!clustersMap) return;
    for (let i = 0; i < clustersMap.length; i++) {
      for (let k = 0; k < clustersMap[i].length; k++) {
        const posX = clustersMap[i][k][1];
        const posY = clustersMap[i][k][0];
        const symbolId = this._fieldMatrix[posY][posX];

        BlockFactory.createBlock({
          blockType: "marked",
          colorRGB: symbolId,
          parent: this.node,
          positionX: posX * BLOCK_SIZE[0],
          positionY: posY * BLOCK_SIZE[1],
          prefab: this.blockPrefab,
        });
      }
    }
  }

  searchCluster(): number[][][] {
    if (
      !this._minClusterSize ||
      !this._fieldMatrix ||
      this._fieldMatrix.length === 0
    )
      return;

    const clusterFinderDFS = new ClusterFinderDFS(this._fieldMatrix, {
      minClusterSize: this._minClusterSize,
      includeDiagonals: false,
    });
    const clustersDFS = clusterFinderDFS.findClusters();
    return clustersDFS;
  }
}
