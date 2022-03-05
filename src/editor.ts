import Crossword from "./crossword";
import { Direction } from "./types";
import View from "./view";
import {lookupWords} from './lookup';


export default class Editor {
    x: number;
    y: number;
    direction: Direction;
    crossword: Crossword;
    view: View;
    editMode: boolean;
    autosave: boolean;
    suggestions: boolean;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = Direction.Across;
        this.editMode = false;
        this.autosave = false;
    }
    
    currentCell(): string|null {
        return this.crossword.getCell(this.x, this.y);
    }

    base(): number[]|null {
        console.log('Base', this.currentCell());
        if (this.currentCell() === null) {
            return null;
        }
        if (this.direction === Direction.Across) {
            for (let i = 1; i <= this.crossword.size; i++) {
                if (this.crossword.getCell(this.x - i, this.y) === null) {
                    return [this.x - i + 1, this.y];
                }
            }
        } else if (this.direction === Direction.Down) {
            for (let i = 1; i <= this.crossword.size; i++) {
                if (this.crossword.getCell(this.x, this.y - i) === null) {
                    return [this.x, this.y - i + 1];
                }
            }
        }
        return null
    }

    currentClue(): number|null {
        const base = this.base();
        if (base === null) {
            return null;
        }
        console.log(base);
        const [x, y] = base;
        if (this.direction === Direction.Across) {
            for (let i = 0; i < this.crossword.across.length; i++) {
                const clue = this.crossword.across[i];
                if (x === clue.x && y === clue.y) {
                    return i;
                }
            }
        } else if (this.direction === Direction.Down) {
            for (let i = 0; i < this.crossword.down.length; i++) {
                const clue = this.crossword.down[i];
                if (x === clue.x && y === clue.y) {
                    return i;
                }
            }
        }
    }

    clearGrid() {
        if (!confirm("Are you sure you want to clear the grid?")) return;
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
        this.hideSuggestions();
    }

    handleToggleEmptyCell() {
        if (this.crossword.across.some(c => c.clue) || this.crossword.down.some(c => c.clue)) {
            if (!confirm("Modifying the empty squares will clear all written clues. Are you sure?")) return;
        }
        if (this.currentCell() === null) {
            this.crossword.setCell(this.x, this.y, "");
        } else {
            this.crossword.setCell(this.x, this.y, null);
        }
        this.crossword.generateClues();
        this.view.updateClues();
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
            this.handleToggleEmptyCell();
        } else if (code === "ArrowLeft") {
            this.x = (this.x - 1 + this.crossword.size) % this.crossword.size;
        } else if (code === "ArrowRight") {
            this.x = (this.x + 1) % this.crossword.size;
        } else if (code === "ArrowUp") {
            this.y = (this.y - 1 + this.crossword.size) % this.crossword.size;
        } else if (code === "ArrowDown") {
            this.y = (this.y + 1) % this.crossword.size;
        } else if (code === "Space") {
            this.flip();
        } else if (code === "Tab") {
            if (e.shiftKey) {
                this.jumpPrev();
            } else {
                this.jumpNext();
            }
            e.preventDefault();
        } else if (code === "Slash") {
            this.suggest();
            return; // Don't hide suggestions
        }
        this.view.update();
        this.hideSuggestions();
    }

    handleChangeAcrossClue(i: number, e) {
        this.crossword.across[i].clue = e.target.value;
        this.view.update();
    }

    handleChangeDownClue(i: number, e) {
        this.crossword.down[i].clue = e.target.value;
        this.view.update();
    }

    flip() {
        this.direction = this.direction === Direction.Across ? Direction.Down : Direction.Across;
    }

    moveNext() {
        let x = this.x;
        let y = this.y;
        if (this.direction === Direction.Across) {
            x += 1;
        } else if (this.direction === Direction.Down) {
            y += 1;
        }
        if (this.crossword.getCell(x, y) === null) {
            this.jumpNext();
        } else {
            this.x = x;
            this.y = y;
        }
    }

    movePrev() {
        let x = this.x;
        let y = this.y;
        if (this.direction === Direction.Across) {
            x -= 1;
        } else if (this.direction === Direction.Down) {
            y -= 1;
        }
        if (this.crossword.getCell(x, y) === null) {
            this.jumpPrev();
            for (let i = 1; i <= this.crossword.size; i++) {
                if (this.direction === Direction.Across) {
                    if (this.crossword.getCell(this.x + i, this.y) === null) {
                        this.x += i - 1;
                        break;
                    }
                } else if (this.direction === Direction.Down) {
                    if (this.crossword.getCell(this.x, this.y + i) === null) {
                        this.y += i - 1;
                        break;
                    }
                }
            }
        } else {
            this.x = x;
            this.y = y;
        }
    }

    jumpNext() {
        const i = this.currentClue();
        if (i === null) return;
        if (this.direction === Direction.Across) {
            const clue = this.crossword.across[(i + 1) % this.crossword.across.length];
            this.x = clue.x;
            this.y = clue.y;
        } else if (this.direction === Direction.Down) {
            const clue = this.crossword.down[(i + 1) % this.crossword.down.length];
            this.x = clue.x;
            this.y = clue.y;
        }
    }

    jumpPrev() {
        const i = this.currentClue();
        if (i === null) return;
        if (this.direction === Direction.Across) {
            const clue = this.crossword.across[(i - 1 + this.crossword.across.length) % this.crossword.across.length];
            this.x = clue.x;
            this.y = clue.y;
        } else if (this.direction === Direction.Down) {
            const clue = this.crossword.down[(i - 1 + this.crossword.down.length) % this.crossword.down.length];
            this.x = clue.x;
            this.y = clue.y;
        }
    }

    getSelected(): string {
        const base = this.base();
        if (base === null) return null;
        const [x, y] = base;
        let out = "";
        if (this.direction === Direction.Across) {
            for (let i = 0; i < this.crossword.size; i++) {
                const cell = this.crossword.getCell(x + i, y);
                if (cell === null) {
                    return out;
                } else if (cell === "") {
                    out += " ";
                } else {
                    out += cell;
                }
            }
        } else if (this.direction === Direction.Down) {
            for (let i = 0; i < this.crossword.size; i++) {
                const cell = this.crossword.getCell(x, y + i);
                if (cell === null) {
                    return out;
                } else if (cell === "") {
                    out += " ";
                } else {
                    out += cell;
                }
            }
        }
    }

    suggest() {
        const query = this.getSelected();
        const possibleWords = lookupWords(query);
        this.view.setSuggestion(possibleWords);
        this.suggestions = true;
    }

    hideSuggestions() {
        this.view.hideSuggestions();
        this.suggestions = false;
    }

    fill(suggestion: string) {
        const base = this.base();
        if (base === null) return;
        const [x, y] = base;
        for (let i = 0; i < suggestion.length; i++) {
            if (this.direction === Direction.Across) {
                this.crossword.setCell(x + i, y, suggestion[i]);
            } else if (this.direction === Direction.Down) {
                this.crossword.setCell(x, y + i, suggestion[i]);
            }
        }
        this.view.update();
        this.hideSuggestions();
    }
}