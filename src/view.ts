import Editor from "./editor";
import { Direction } from "./types";

export default class View {
    editor: Editor;
    createdSize: number;

    constructor(editor: Editor) {
        this.editor = editor;
    }

    getElem(x: number, y: number) {
        return document.querySelector(`.cell.x${x}y${y}`);
    }

    currentElem() {
        return this.getElem(this.editor.x, this.editor.y);
    }

    create() {
        this.createdSize = this.editor.crossword.size;
        const table = document.querySelector(".crossword");
        table.innerHTML = "";
        for (let y = 0; y < this.createdSize; y++) {
            const tr = document.createElement("tr");
            for (let x = 0; x < this.createdSize; x++) {
                const td = document.createElement("td");
                td.classList.add("cell", `x${x}y${y}`);
                td.addEventListener("click", () => this.editor.handleGridClick(x, y));
                tr.append(td);
                td.innerHTML = "<div class=\"number\"></div><div class=\"value\"></div>";
            }
            table.append(tr);
        }
    }
    
    update() {
        if (this.editor.autosave) {
            const code = this.editor.crossword.save();
            localStorage.setItem("default", code);
        }
        if (this.editor.crossword.size !== this.createdSize) {
            this.create();
        }
        document.querySelectorAll(".cell.selected,.cell.selected-alt").forEach(el => {
            el.classList.remove("selected");
            el.classList.remove("selected-alt");
        });
        document.querySelectorAll("li").forEach(el => {
            el.classList.remove("selected");
            el.classList.remove("selected-alt");
        });
        this.currentElem().classList.add("selected");
        if (this.editor.currentCell() !== null) {
            const x = this.editor.x;
            const y = this.editor.y;
            if (this.editor.direction === Direction.Across) {
                let i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x + i, y) === null) {
                        break;
                    }
                    this.getElem(x + i, y).classList.add("selected-alt");
                }
                i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x - i, y) === null) {
                        break;
                    }
                    this.getElem(x - i, y).classList.add("selected-alt");
                }
                let elem = document.querySelector(`li.ax${x-i+1}y${y}`);
                if (elem) {
                    elem.scrollIntoView({behavior: "smooth", block: "center"});
                    elem.classList.add("selected");
                }
                i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x, y - i) === null) {
                        break;
                    }
                }
                elem = document.querySelector(`li.dx${x}y${y-i+1}`);
                if (elem) {
                    elem.classList.add("selected-alt");
                }
            } else if (this.editor.direction === Direction.Down) {
                let i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x, y + i) === null) {
                        break;
                    }
                    this.getElem(x, y + i).classList.add("selected-alt");
                }
                i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x, y - i) === null) {
                        break;
                    }
                    this.getElem(x, y - i).classList.add("selected-alt");
                }
                let elem = document.querySelector(`li.dx${x}y${y-i+1}`);
                if (elem) {
                    elem.scrollIntoView({behavior: "smooth", block: "center"});
                    elem.classList.add("selected");
                }
                i = 1;
                for (; i < this.editor.crossword.size; i++) {
                    if (this.editor.crossword.getCell(x - i, y) === null) {
                        break;
                    }
                }
                elem = document.querySelector(`li.ax${x-i+1}y${y}`);
                if (elem) {
                    elem.classList.add("selected-alt");
                }
            }
        }

        for (let x = 0; x < this.editor.crossword.size; x++) {
            for (let y = 0; y < this.editor.crossword.size; y++) {
                const elem = document.querySelector(`.cell.x${x}y${y}`);
                const val = this.editor.crossword.getCell(x, y);
                if (val === null) {
                    elem.classList.add("black");
                    elem.querySelector(".value").textContent = "";
                } else {
                    elem.classList.remove("black");
                    elem.querySelector(".value").textContent = val;
                }
            }
        }

        document.querySelectorAll(".cell .number").forEach(el => {
            el.textContent = "";
        });
        this.editor.crossword.across.forEach(c => {
            const elem = document.querySelector(`.cell.x${c.x}y${c.y} .number`);
            elem.textContent = c.index.toString();
        });
        this.editor.crossword.down.forEach(c => {
            const elem = document.querySelector(`.cell.x${c.x}y${c.y} .number`);
            elem.textContent = c.index.toString();
        });
    }

    updateClues() {
        let i = 0;
        const across = document.querySelector(".clues.across");
        across.innerHTML = "";
        this.editor.crossword.across.forEach(el => {
            const li = document.createElement("li");
            li.classList.add(`ax${el.x}y${el.y}`);
            if (this.editor.editMode) {
                const textarea = document.createElement("textarea");
                textarea.value = el.clue || "";
                const index = i;
                textarea.addEventListener("change", (e) => this.editor.handleChangeAcrossClue(index, e));
                li.append(`${el.index}. `, textarea, ` (${el.length})`);
            } else {
                li.append(`${el.index}. ${el.clue || ""} (${el.length})`);
            }
            li.addEventListener("click", () => this.editor.goto(el.x, el.y, Direction.Across));
            across.append(li);
            i++;
        });
        i = 0;
        const down = document.querySelector(".clues.down");
        down.innerHTML = "";
        this.editor.crossword.down.forEach(el => {
            const li = document.createElement("li");
            li.classList.add(`dx${el.x}y${el.y}`);
            if (this.editor.editMode) {
                const textarea = document.createElement("textarea");
                textarea.value = el.clue || "";
                const index = i;
                textarea.addEventListener("change", (e) => this.editor.handleChangeDownClue(index, e));
                li.append(`${el.index}. `, textarea, ` (${el.length})`);
            } else {
                li.append(`${el.index}. ${el.clue || ""} (${el.length})`);
            }
            li.addEventListener("click", () => this.editor.goto(el.x, el.y, Direction.Down));
            down.append(li);
            i++;
        });
        document.querySelector(".clue-count.across").textContent = `(${this.editor.crossword.across.length})`;
        document.querySelector(".clue-count.down").textContent = `(${this.editor.crossword.down.length})`;
    }

    setSuggestion(suggestions: string[]) {
        const base = this.editor.base();
        if (base === null) return;
        const [x, y] = base;
        const elem = document.querySelector(`.cell.x${x}y${y}`);
        const rect = elem.getBoundingClientRect();
        const suggestionBox: HTMLElement = document.querySelector(".suggestion-box");
        suggestionBox.style.top = "inherit";
        suggestionBox.style.bottom = "inherit";
        suggestionBox.style.left = "inherit";
        suggestionBox.style.right = "inherit";
        if (this.editor.direction === Direction.Across) {
            if (rect.y > window.innerHeight / 2) {
                suggestionBox.style.bottom = window.innerHeight - rect.top + "px";
            } else {
                suggestionBox.style.top = rect.bottom + "px";
            }
            suggestionBox.style.left = rect.left + "px";
        } else if (this.editor.direction === Direction.Down) {
            suggestionBox.style.top = rect.top + "px";
            suggestionBox.style.right = window.innerWidth - rect.left + "px";
        }
        suggestionBox.classList.add("show");
        const suggestionsCount = suggestionBox.querySelector(".suggestion-count");
        suggestionsCount.textContent = `${suggestions.length} suggestions...`;
        const suggestionsList = suggestionBox.querySelector(".suggestions");
        suggestionsList.innerHTML = "";
        const shuffled = suggestions.sort(() => 0.5 - Math.random());
        shuffled.slice(0, 10).forEach(suggestion => {
            const elem = document.createElement("div");
            elem.textContent = suggestion;
            elem.addEventListener("click", () => this.editor.fill(suggestion));
            suggestionsList.append(elem);
        });
    }

    hideSuggestions() {
        const suggestionBox: HTMLElement = document.querySelector(".suggestion-box");
        suggestionBox.classList.remove("show");
    }
}
