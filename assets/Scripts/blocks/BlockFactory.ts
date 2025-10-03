import { _decorator, Component, instantiate, Node, Prefab, Sprite } from "cc";
import { Block } from "./Block";
import { SimpleBlock } from "./SimpleBlock";
import { MarkedBlock } from "./MarkedBlock";
import { ColorType } from "../types/blocks";
const { ccclass, property } = _decorator;

type BlockType = "simple" | "marked";
type CreateBlockType = {
  blockType: BlockType;
  prefab: Prefab;
  parent: Node;
  positionX: number;
  positionY: number;
  colorRGB: ColorType;
};

@ccclass("BlockFactory")
export class BlockFactory extends Component {
  // Метод для создания блока по типу
  public static createBlock({
    blockType,
    parent,
    positionX,
    positionY,
    prefab,
    colorRGB,
  }: CreateBlockType): Block | null {
    if (!prefab) {
      console.error("Prefab is null!");
      return null;
    }

    const blockNode = instantiate(prefab);
    if (!blockNode) {
      console.error("Failed to instantiate prefab!");
      return null;
    }

    parent.addChild(blockNode);
    // позиционирование блока
    blockNode.setPosition(positionX, positionY, 0);

    let blockComponent: Block | null = null;

    // Определяем тип блока и добавляем соответствующий компонент
    switch (blockType) {
      case "simple":
        blockComponent = blockNode.addComponent(SimpleBlock);
        break;
      case "marked":
        blockComponent = blockNode.addComponent(MarkedBlock);
        break;
      default:
        console.error("Unknown block type!");
        return null;
    }

    if (!blockComponent) {
      console.error("Failed to add block component!");
      return null;
    }

    // Инициализируем блок
    blockComponent.init(colorRGB);
    return blockComponent;
  }
}
