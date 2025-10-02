import { _decorator, Component, director, EventTarget, Node, Prefab } from "cc";
import { BlockFactory } from "./blocks";
import { BLOCK_SIZE, GameManager } from "./GameManager";
import { ClusterFinderDFS } from "./utils";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("MarkedBlocksManager")
@executeInEditMode
export class MarkedBlocksManager extends Component {
  /**
   * @ru
   * Префаб блока
   *  */
  @property({ type: Prefab })
  public blockPrefab: Prefab | null = null;

  @property({ type: GameManager })
  public gameManager: GameManager;

  private _blockForColorTypesMatrix: number[][] = [];
  private _fieldMatrix: number[][] = [];
  private _clustersSize: number;

  protected onLoad(): void {
    director.on("game-manager-update", this.listenGameManager, this);
  }

  protected onDestroy(): void {
    director.off("game-manager-update", this.listenGameManager, this);
  }

  rerender(): void {
    this.generateMap();
  }

  listenGameManager(): void {
    if (!this.gameManager) return;

    this._blockForColorTypesMatrix = this.gameManager.blockForColorTypesMatrix;
    this._fieldMatrix = this.gameManager.fieldMatrix;
    this.rerender();
  }

  generateMap(): void {
    if (!this.blockPrefab) {
      console.error("Block prefab is not set!");
      return;
    }
    if (!this.gameManager) return;
    this.node.removeAllChildren();

    // размещение блоков на сцене
    this._clustersSize = this.gameManager?.Y;
    const clustersMap = this.searchCluster();

    if (!clustersMap) return;
    for (let i = 0; i < clustersMap.length; i++) {
      for (let k = 0; k < clustersMap[i].length; k++) {
        const posX = clustersMap[i][k][1];
        const posY = clustersMap[i][k][0];
        const colorType = this._fieldMatrix[posY][posX];
        const colorRGB = this._blockForColorTypesMatrix[colorType];

        BlockFactory.createBlock({
          blockType: "marked",
          colorRGB: colorRGB,
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
      !this._clustersSize ||
      !this._fieldMatrix ||
      this._fieldMatrix.length === 0
    )
      return;

    const clusterFinderDFS = new ClusterFinderDFS(this._fieldMatrix, {
      minClusterSize: this._clustersSize,
      includeDiagonals: false,
    });
    const clustersDFS = clusterFinderDFS.findClusters();
    return clustersDFS;
  }
}
