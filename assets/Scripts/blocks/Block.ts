import { _decorator, Color, Component, Node, Sprite } from "cc";
import { ColorType } from "../types/blocks";
import { SeededRandom } from "../utils";
const { ccclass, property } = _decorator;

@ccclass("Block")
export abstract class Block extends Component {
  // Общий метод для инициализации блока
  public init(colorType: ColorType): void {
    this.setupBlock(colorType);
  }

  // Абстрактный метод для отображения блока (реализуется в дочерних классах)
  protected abstract setupBlock(colorType: ColorType): void;

  // Общий метод для изменения цвета блока
  protected setBlockColor(color: Color): void {
    const sprite = this.node.getComponent(Sprite);
    if (sprite) {
      sprite.color = color;
    }
  }
}
