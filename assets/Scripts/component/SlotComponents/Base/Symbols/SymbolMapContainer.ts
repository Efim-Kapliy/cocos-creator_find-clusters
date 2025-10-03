import { _decorator, CCString, Component, EventTarget, Node, Prefab } from "cc";
import { SymbolMapItem } from "./SymbolMapItem";
const { ccclass, property } = _decorator;

@ccclass("SymbolMapContainer")
export class SymbolMapContainer extends Component {
  @property({ type: [SymbolMapItem], displayName: "Symbol Map" })
  public symbolMap: SymbolMapItem[] = [];

  private _eventTarget: EventTarget = new EventTarget();

  public get eventTarget(): EventTarget {
    return this._eventTarget;
  }

  public addItem(item: SymbolMapItem) {
    this.symbolMap.push(item);
    this._eventTarget.emit("symbol-map-changed", this.symbolMap);
  }

  public removeItem(index: number) {
    // Проверяем, можно ли удалять элемент
    if (this.canRemoveItem(index)) {
      this.symbolMap.splice(index, 1);
      this._eventTarget.emit("symbol-map-changed", this.symbolMap);
    } else {
      console.warn("Cannot remove locked item!");
    }
  }

  // Метод для получения префаба по ID
  public getPrefabById(id: string): Prefab | null {
    const item = this.symbolMap.find((item) => item.id === id);
    return item ? item.prefab : null;
  }

  // Метод для получения spinningSymbolPrefab по ID
  public getSpinningPrefabById(id: string): Prefab | null {
    const item = this.symbolMap.find((item) => item.id === id);
    return item ? item.spinningSymbolPrefab : null;
  }

  // Запретить удалять элементы с активным флагом
  private canRemoveItem(index: number): boolean {
    return !this.symbolMap[index].locked;
  }
}
