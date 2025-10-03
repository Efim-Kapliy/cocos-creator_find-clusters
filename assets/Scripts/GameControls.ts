import {
  _decorator,
  Button,
  Component,
  director,
  EditBox,
  Node,
  Toggle,
} from "cc";
import { GameManager } from "./GameManager";
import { RandomRange } from "./utils/RandomRange";
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
  public inputY: EditBox | null = null;

  @property({ type: Toggle })
  public checkboxSeed: Toggle | null = null;

  @property({ type: EditBox })
  public inputSeed: EditBox | null = null;

  @property({ type: Button })
  public submitButton: Button | null = null;

  protected onLoad(): void {
    director.on("game-manager-update", this.listenGameManager, this);

    if (this.submitButton) {
      this.submitButton.node.on(Button.EventType.CLICK, this.onSubmit, this);
    }
  }

  protected start(): void {}

  protected onDestroy(): void {
    director.off("game-manager-update", this.listenGameManager, this);

    if (this.submitButton?.node) {
      this.submitButton.node.off(Button.EventType.CLICK, this.onSubmit, this);
    }
  }

  private listenGameManager(): void {
    if (!this.gameManager) return;

    this.inputM.string = `${this.gameManager.M}`;
    this.inputN.string = `${this.gameManager.N}`;
    this.inputY.string = `${this.gameManager.Y}`;
    this.inputSeed.string = `${this.gameManager.SeedRandom}`;
    this.checkboxSeed.isChecked = this.gameManager.checkboxSeed;
  }

  private onSubmit(): void | undefined {
    if (!this.gameManager) return;
    const inputM = this.validateEditBoxToNumber(this.inputM);
    const inputN = this.validateEditBoxToNumber(this.inputN);
    const inputY = this.validateEditBoxToNumber(this.inputY);
    const checkboxSeed = this.checkboxSeed.isChecked;
    const inputSeed = this.processSeed(this.inputSeed);

    if (!inputM || !inputN || !inputY || !inputSeed) return;

    // Передаем значение в GameManager
    this.gameManager.addScore({
      m: inputM,
      n: inputN,
      y: inputY,
      seed: inputSeed,
      checkboxSeed,
    });
  }

  private validateEditBoxToNumber(input: EditBox): number | null {
    if (!input) return null;

    const content = input.string;

    if (!content) {
      console.error("Input field is empty");
      return null;
    }

    const numericInput = parseInt(content, 10);

    if (isNaN(numericInput)) {
      console.error("Invalid input: not a number");
      return null;
    }

    return numericInput;
  }

  private processSeed(seed: EditBox): number | null {
    const checkboxSeed = this.checkboxSeed.isChecked;
    if (checkboxSeed) {
      return this.validateEditBoxToNumber(seed);
    }

    const rangeInclusive = new RandomRange(1, 1_000, true);
    return rangeInclusive.getRandomInt();
  }
}
