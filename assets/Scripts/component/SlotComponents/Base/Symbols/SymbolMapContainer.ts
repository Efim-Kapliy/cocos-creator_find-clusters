import { _decorator, Component, EventTarget, Prefab } from "cc";
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

  // Получить количество символов
  public getNumberSymbols(): number {
    return this.symbolMap.length;
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

  // TODO: Нерабочая реализация locked, нужно добавить скрытие значка корзины в редакторе
  // Запретить удалять элементы с активным флагом
  private canRemoveItem(index: number): boolean {
    return !this.symbolMap[index].locked;
  }
}
