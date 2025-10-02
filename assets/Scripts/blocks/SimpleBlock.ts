import { _decorator, Color, Component, Node } from "cc";
import { Block } from "./Block";
import { ColorType } from "../types/blocks";
const { ccclass, property } = _decorator;

@ccclass("SimpleBlock")
export class SimpleBlock extends Block {
  protected setupBlock(colorRGB: ColorType): void {
    this.setBlockColor(new Color(colorRGB[0], colorRGB[1], colorRGB[2], 128));
  }
}
