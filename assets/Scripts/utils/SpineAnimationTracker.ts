import { _decorator, Button, Component, Node, sp } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SpineAnimationTracker")
export class SpineAnimationTracker extends Component {
  private promises: Promise<void>[] = [];
  private spineNodes: sp.Skeleton[] = [];
  private button: Button | null = null;

  /**
   * Устанавливает кнопку, которую нужно блокировать/разблокировать.
   * @param button @ru
   * Кнопка для блокировки.
   */
  public setButton(button: Button): void {
    this.button = button;
  }

  /**
   * Добавляет Spine-анимацию для отслеживания.
   * @param spineNode @ru
   * Узел Spine-анимации.
   * @param animationName @ru
   * Название анимации, которую нужно отслеживать.
   * @param loop @ru
   * Зациклена ли анимация (по умолчанию false).
   */
  public addSpineAnimation(
    spineNode: sp.Skeleton,
    animationName: string,
    loop: boolean = false
  ): void {
    const promise = new Promise<void>((resolve) => {
      spineNode.setCompleteListener(() => {
        resolve();
      });
    });

    this.promises.push(promise);
    this.spineNodes.push(spineNode);
    spineNode.setAnimation(0, animationName, loop);
  }

  /**
   * @ru
   * Ожидает завершения всех анимаций.
   * @returns Promise, который разрешится, когда все анимации завершатся.
   */
  public async waitForAllAnimations(): Promise<void> {
    if (this.button) {
      this.button.interactable = false; // Блокируем кнопку
    }

    await Promise.all(this.promises);

    if (this.button) {
      this.button.interactable = true; // Разблокируем кнопку
    }

    this.clear();
  }

  /**
   * @ru
   * Очищает все отслеживаемые анимации и промисы.
   */
  private clear(): void {
    this.promises = [];
    this.spineNodes = [];
  }
}
