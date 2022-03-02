import Crossword from "./crossword";
import { Direction } from "./types";
import View from "./view";


export default class Editor {
    x: number;
    y: number;
    direction: Direction;
    crossword: Crossword;
    view: View;
    editMode: boolean;
    autosave: boolean;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = Direction.Across;
        this.editMode = false;
        this.autosave = false;
    }
    
    currentCell() {
        return this.crossword.getCell(this.x, this.y);
    }

    clearGrid() {
        this.crossword.clearGrid();
        this.view.update();
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.view.updateClues();
    }

    handleGridClick(x: number, y: number) {
        if (x === this.x && y === this.y) {
            this.flip();
        } else {
            this.x = x;
            this.y = y;
        }
        this.view.update();
    }

    goto(x: number, y: number, direction: Direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.view.update();
    }

    handleKeyDown(e) {
        if (e.ctrlKey) return;
        if (document.activeElement !== document.body) return;
        const {code, key} = e;
        if (key.length === 1 && (/[a-zA-Z]/).test(key)) {
            this.crossword.setCell(this.x, this.y, key);
            this.moveNext();
        } else if (code === "Backspace") {
            if (this.currentCell() === null) {
                return;
            }
            if (this.currentCell() === "") {
                this.movePrev();
            }
            this.crossword.setCell(this.x, this.y, "");
        } else if (code === "Delete") {
            this.crossword.setCell(this.x, this.y, "");
        } else if (code === "Minus") {
            if (this.currentCell() === null) {
                this.crossword.setCell(this.x, this.y, "");
            } else {
                this.crossword.setCell(this.x, this.y, null);
            }
            this.crossword.generateClues();
            this.view.updateClues();
        } else if (code === "ArrowLeft") {
            this.movePrev();
        } else if (code === "ArrowRight") {
            this.moveNext();
        } else if (code === "ArrowUp") {
            this.y = (this.y - 1 + this.crossword.size) % this.crossword.size;
        } else if (code === "ArrowDown") {
            this.y = (this.y + 1 + this.crossword.size) % this.crossword.size;
        } else if (code === "Space") {
            this.flip();
        }
        this.view.update();
    }

    handleChangeAcrossClue(i, e) {
        this.crossword.across[i].clue = e.target.value;
    }

    handleChangeDownClue(i, e) {
        this.crossword.down[i].clue = e.target.value;
    }

    flip() {
        this.direction = this.direction === Direction.Across ? Direction.Down : Direction.Across;
    }

    moveNext() {
        if (this.direction === Direction.Across) {
            this.x += 1;
        } else if (this.direction === Direction.Down) {
            this.y += 1;
        }
        while (true) {
            if (this.x >= this.crossword.size) {
                this.x = 0;
                if (this.direction === Direction.Across) {
                    this.y += 1;
                }
                continue;
            }
            if (this.y >= this.crossword.size) {
                this.y = 0;
                if (this.direction === Direction.Down) {
                    this.x += 1;
                }
                continue;
            }
            if (this.currentCell() === null) {
                this.moveNext();
            }
            break;
        }
    }

    movePrev() {
        if (this.direction === Direction.Across) {
            this.x -= 1;
        } else if (this.direction === Direction.Down) {
            this.y -= 1;
        }
        while (true) {
            if (this.x < 0) {
                this.x = this.crossword.size - 1;
                if (this.direction === Direction.Across) {
                    this.y -= 1;
                }
                continue;
            }
            if (this.y < 0) {
                this.y = this.crossword.size - 1;
                if (this.direction === Direction.Down) {
                    this.x -= 1;
                }
                continue;
            }
            if (this.currentCell() === null) {
                this.movePrev();
            }
            break;
        }
        this.view.update();
    }
}