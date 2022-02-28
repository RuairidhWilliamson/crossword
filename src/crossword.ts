import Clue from "./clue";
import { Direction } from "./types";
import View from "./view";

function directionToString(direction: Direction): string {
    return direction === Direction.Across ? "across" : "down";
}

function stringToDirection(direction: string): Direction {
    return direction === "across" ? Direction.Across : Direction.Down;
}

export default class Crossword {
    size: number;
    grid: (string|null)[];
    across: Clue[];
    down: Clue[];
    view: View;

    constructor() {
        this.new(15);
    }

    new(size: number) {
        this.size = size;
        this.grid = new Array(this.size * this.size);
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.setCell(x, y, "");
            }
        }
        this.across = [];
        this.generateClues();
    }

    clearGrid() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.getCell(x, y) === null) continue;
                this.setCell(x, y, "");
            }
        }
    }

    getCell(x: number, y: number): string|null {
        if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
            return null;
        }
        return this.grid[x + y * this.size];
    }

    setCell(x: number, y: number, value: string|null) {
        this.grid[x + y * this.size] = value;
    }

    load(code: string) {
        let puzzle = JSON.parse(code);
        this.new(puzzle.size);
        let s = puzzle.grid;
        let i = 0;
        for (let y = 0; y < puzzle.size; y++) {
            for (let x = 0; x < puzzle.size; x++) {
                if (s[i] === "-") {
                    this.setCell(x, y, null);
                } else if (s[i] === "_") {
                    this.setCell(x, y, "");
                } else {
                    this.setCell(x, y, s[i]);
                }
                i += 1;
            }
        }
        // this.view.updateNumbers();
        this.generateClues();
        this.view.update();
        let across = puzzle.across;
        for (let i = 0; i < across.length; i++) {
            if (across[i]) {
                this.across[i].clue = across[i];
            }
        }
        let down = puzzle.down;
        for (let i = 0; i < down.length; i++) {
            if (down[i]) {
                this.down[i].clue = down[i];
            }
        }
        this.view.updateClues();
    }

    save() {
        let output = {
            size: this.size,
            grid: null,
            across: null,
            down: null,
        };
        let grid = "";
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const elem = this.getCell(x, y);
                if (elem === null) {
                    grid += "-";
                } else if (elem === "") {
                    grid += "_";
                } else {
                    grid += elem;
                }
            }
        }
        output.grid = grid;
        let across = this.across.map(c => c.clue);
        let down = this.down.map(c => c.clue);
        output.across = across;
        output.down = down;
        return JSON.stringify(output);
    }

    generateClues() {
        // Down
        let down = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.getCell(x, y) === null) continue;
                if (y === 0 || this.getCell(x, y - 1) === null) {
                    let length = 1;
                    while (length <= this.size && this.getCell(x, y + length) !== null) {
                        length++;
                    }
                    if (length > 1) {
                        down.push(new Clue(x, y, Direction.Down, length));
                    }
                }
            }
        }

        // Across
        let across = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.getCell(x, y) === null) continue;
                if (x === 0 || this.getCell(x - 1, y) === null) {
                    let length = 1;
                    while (length <= this.size && this.getCell(x + length, y) !== null) {
                        length++;
                    }
                    if (length > 1) {
                        across.push(new Clue(x, y, Direction.Across, length));
                    }
                }
            }
        }
        
        let clueNumber = 1;
        let i = 0;
        let j = 0;
        while (i < down.length || j < across.length) {
            const currentDown = down[i] || {x: Infinity, y: Infinity};
            const currentAcross = across[j] || {x: Infinity, y: Infinity};
            if (currentDown.y == currentAcross.y) {
                if (currentDown.x == currentAcross.x) {
                    currentAcross.index = clueNumber;
                    currentDown.index = clueNumber;
                    clueNumber++;
                    i++;
                    j++;
                    continue;
                }

                if (currentDown.x < currentAcross.x) {
                    currentDown.index = clueNumber;
                    clueNumber++;
                    i++;
                    continue;

                }
            }
            if (currentDown.y < currentAcross.y) {
                currentDown.index = clueNumber;
                clueNumber++;
                i++;
                continue;
            }
            currentAcross.index = clueNumber;
            clueNumber++;
            j++;
        }
        this.across = across;
        this.down = down;
    }
}