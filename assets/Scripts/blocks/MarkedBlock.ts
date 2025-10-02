import { _decorator, Color, Component, Node, tween, v3 } from "cc";
import { Block } from "./Block";
import { ColorType } from "../types/blocks";
const { ccclass, property } = _decorator;

@ccclass("MarkedBlock")
export class MarkedBlock extends Block {
  protected setupBlock(colorRGB: ColorType): void {
    this.setBlockColor(new Color(colorRGB[0], colorRGB[1], colorRGB[2], 255));

    // Анимация масштаба
    tween(this.node)
      .to(0.5, { scale: v3(1.2, 1.2, 1.2) })
      .to(0.5, { scale: v3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();
  }
}
