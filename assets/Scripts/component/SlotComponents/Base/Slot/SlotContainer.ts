import { _decorator, Component, director, instantiate, sp } from "cc";
import { GameManager } from "db://assets/Scripts/GameManager";
import { SymbolMapContainer } from "../Symbols/SymbolMapContainer";
import {
  mType,
  seedType,
  yType,
} from "db://assets/Scripts/types/gameManagerTypes";
import { ClusterFinderDFS, SeededRandom } from "db://assets/Scripts/utils";
import { SpineAnimationTracker } from "db://assets/Scripts/utils/SpineAnimationTracker";
import { GameControls } from "db://assets/Scripts/GameControls";
const { ccclass, property, executeInEditMode } = _decorator;

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
@executeInEditMode
export class SlotContainer extends Component {
  @property({ type: GameManager })
  public gameManager: GameManager;

  @property({ type: GameControls })
  public gameControls: GameControls;

  private _numberHorizontalCharacters: mType;
  private _minClusterSize: yType;
  private _seedRandom: seedType;
  private _mapLength: number;
  private _fieldMatrix: number[][] = [];
  private _symbolPrefabs: SymbolMapContainer | null = null;

  protected onLoad(): void {
    director.on("game-manager-update", this.listenGameManager, this);
  }

  protected onDestroy(): void {
    director.off("game-manager-update", this.listenGameManager, this);
  }

  rerender(): void {
    this.positioningSymbolsOnSlot();
  }

  private listenGameManager(): void {
    if (!this.gameManager) return;

    this._numberHorizontalCharacters = this.gameManager?.M;
    this._minClusterSize = this.gameManager?.Y;
    this._seedRandom = this.gameManager?.SeedRandom;
    this._mapLength = this.gameManager?.M * this.gameManager?.N;
    this.rerender();
  }

  // генерация матрицы последовательности блоков
  private generationOfSymbolSequenceMatrix(): void {
    const random = new SeededRandom(this._seedRandom);
    let lineMatrix: number[] = [];
    const symbolMapContainer =
      this.gameManager?.getComponent(SymbolMapContainer);
    if (!symbolMapContainer) return;

    const numberCharacters = symbolMapContainer.getNumberSymbols();
    if (numberCharacters <= 0) return;

    for (let i = 1; i <= this._mapLength; i++) {
      lineMatrix.push(random.range(0, numberCharacters - 1));

      if (i % this._numberHorizontalCharacters == 0) {
        this._fieldMatrix.push(lineMatrix);
        lineMatrix = [];
      }
    }
  }

  private positioningSymbolsOnSlot(): void {
    this._fieldMatrix = [];
    this.generationOfSymbolSequenceMatrix();

    if (this._fieldMatrix.length === 0) {
      console.error("The slot matrix is empty!");
      return;
    }

    if (!this.gameManager) return;
    this._symbolPrefabs = this.gameManager?.getComponent(SymbolMapContainer);
    if (!this._symbolPrefabs) {
      console.error("Prefabs not found!");
      return;
    }

    this.node.removeAllChildren();

    for (let y = 0; y < this._fieldMatrix.length; y++) {
      // Создание блоков по линии в матрице
      for (let x = 0; x < this._fieldMatrix[y].length; x++) {
        console.log(this._fieldMatrix);
        const positionX = x * BLOCK_SIZE[0];
        const positionY = y * BLOCK_SIZE[1];
        const symbolId = this._fieldMatrix[y][x];
        // ! Есть костыль для symbolId в виде строки — `${symbolId}`
        const symbolPrefab = this._symbolPrefabs.getPrefabById(`${symbolId}`);
        if (!symbolPrefab) continue;
        // Инстанцируем префаб
        const prefabNode = instantiate(symbolPrefab);
        if (!prefabNode) {
          console.error("Failed to instantiate prefab!");
          continue;
        }
        this.node.addChild(prefabNode);

        // Позиционирование блока
        prefabNode.setPosition(positionX, positionY, 0);

        // Ищем ноду со Spine-анимацией
        const spineNode = prefabNode.getComponentInChildren(sp.Skeleton);
        if (!spineNode) {
          console.error("No node with Spine found!");
          continue;
        }

        spineNode.setAnimation(0, "idle", false);
      }
    }

    this.addWinAnimation();
  }

  // Запуск анимации выигрыша у кластеров
  private addWinAnimation(): void {
    const clustersMap = this.searchCluster();
    const spineAnimationTracker = new SpineAnimationTracker();

    // Поиск блоков по кластерам
    for (const cluster of clustersMap) {
      // создание блоков по линии в матрице
      for (const [posY, posX] of cluster) {
        // Ищем узел по позиции в матрице
        const childIndex = posY * this._fieldMatrix[0].length + posX;
        if (childIndex < 0 || childIndex >= this.node.children.length) {
          console.error(`Invalid child index: ${childIndex}`);
          continue;
        }

        const childNode = this.node.children[childIndex];
        if (!childNode) {
          console.error(`No child node at (${posX}, ${posY})`);
          continue;
        }
        // Ищем Spine-компонент
        const spineNode = childNode.getComponentInChildren(sp.Skeleton);
        if (!spineNode) {
          console.error(`No Spine component at (${posX}, ${posY})`);
          continue;
        }
        // Меняем анимацию на "win"
        spineAnimationTracker.addSpineAnimation(spineNode, "win", false);
      }
    }

    // Ждём выполнение всех win-анимаций и блокируем кнопку
    if (!this.gameControls || !this.gameControls?.submitButton) {
      console.error("Button in gameControls not set");
    } else {
      spineAnimationTracker.setButton(this.gameControls?.submitButton);
    }

    spineAnimationTracker
      .waitForAllAnimations()
      .then(() => console.log("Все Spine-анимации завершены!"));
  }

  private searchCluster(): number[][][] | null {
    if (
      !this._minClusterSize ||
      !this._fieldMatrix ||
      this._fieldMatrix.length === 0
    )
      return null;

    const clusterFinderDFS = new ClusterFinderDFS(this._fieldMatrix, {
      minClusterSize: this._minClusterSize,
      includeDiagonals: false,
    });
    const clustersDFS = clusterFinderDFS.findClusters();
    return clustersDFS;
  }
}
