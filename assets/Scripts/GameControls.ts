import { _decorator, Button, Component, director, EditBox, Node } from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("GameControls")
export class GameControls extends Component {
  @property({ type: GameManager })
  public gameManager: GameManager;

  @property({ type: EditBox })
  public inputM: EditBox | null = null;

  @property({ type: EditBox })
  public inputN: EditBox | null = null;

  @property({ type: EditBox })
  public inputX: EditBox | null = null;

  @property({ type: EditBox })
  public inputY: EditBox | null = null;

  @property({ type: Button })
  public submitButton: Button | null = null;

  protected onLoad(): void {
    director.on("game-manager-update", this.listenGameManager, this);

    if (this.submitButton) {
      this.submitButton.node.on(Button.EventType.CLICK, this.onSubmit, this);
    }
  }

  protected onDestroy(): void {
    director.off("game-manager-update", this.listenGameManager, this);

    if (this.submitButton) {
      this.submitButton.node.off(Button.EventType.CLICK, this.onSubmit, this);
    }
  }

  private listenGameManager(): void {
    if (!this.gameManager) return;

    this.inputM.string = `${this.gameManager.M}`;
    this.inputN.string = `${this.gameManager.N}`;
    this.inputX.string = `${this.gameManager.X}`;
    this.inputY.string = `${this.gameManager.Y}`;
  }

  private onSubmit(): void {
    if (
      !this.inputM ||
      !this.inputN ||
      !this.inputX ||
      !this.inputY ||
      !this.gameManager
    )
      return;

    const inputM = this.inputM.string;
    const inputN = this.inputN.string;
    const inputX = this.inputX.string;
    const inputY = this.inputY.string;

    if (!inputM || !inputN || !inputX || !inputY) {
      console.error("Input field is empty");
      return;
    }

    const numericInputM = parseInt(inputM, 10);
    const numericInputN = parseInt(inputN, 10);
    const numericInputX = parseInt(inputX, 10);
    const numericInputY = parseInt(inputY, 10);

    if (
      (isNaN(numericInputM),
      isNaN(numericInputN),
      isNaN(numericInputX),
      isNaN(numericInputY))
    ) {
      console.error("Invalid input: not a number");
      return;
    }

    // Передаем значение в GameManager
    this.gameManager.addScore({
      M: numericInputM,
      N: numericInputN,
      X: numericInputX,
      Y: numericInputY,
    });
  }
}
