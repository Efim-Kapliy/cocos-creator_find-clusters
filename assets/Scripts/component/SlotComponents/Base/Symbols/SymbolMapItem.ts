import { _decorator, CCString, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SymbolMapItem")
export class SymbolMapItem {
  @property({ type: CCString, displayName: "ID" })
  id: string = "";
  @property({ type: Prefab, displayName: "Prefab" })
  readonly prefab: Prefab | null = null;
  @property({ type: Prefab, displayName: "Spinning Symbol Prefab" })
  readonly spinningSymbolPrefab: Prefab | null = null;
  @property({ type: Boolean, displayName: "Locked" })
  public locked: boolean = false;
}
