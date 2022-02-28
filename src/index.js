let selected = {
    x: 0,
    y: 0,
    direction: "across",
    size: 9,
    edit: true,
    update() {
        document.querySelectorAll(".cell.selected,.cell.selected-alt").forEach(el => {
            el.classList.remove("selected");
            el.classList.remove("selected-alt");
        });
        document.querySelectorAll("li").forEach(el => {
            el.classList.remove("selected");
        });
        this.elem().classList.add("selected");
        const x = this.x;
        const y = this.y;
        if (this.direction === "across") {
            let i = 1;
            for (; i < this.size; i++) {
                if (getElem(x + i, y) === null) {
                    break;
                }
                getElem(x + i, y).classList.add("selected-alt");
            }
            i = 1;
            for (; i < this.size; i++) {
                if (getElem(x - i, y) === null) {
                    break;
                }
                getElem(x - i, y).classList.add("selected-alt");
            }
            const elem = document.querySelector(`li.ax${x-i+1}y${y}`);
            if (elem) {
                elem.classList.add("selected");
            }
        } else {
            let i = 1;
            for (; i < this.size; i++) {
                if (getElem(x, y + i) === null) {
                    break;
                }
                getElem(x, y + i).classList.add("selected-alt");
            }
            i = 1;
            for (; i < this.size; i++) {
                if (getElem(x, y - i) === null) {
                    break;
                }
                getElem(x, y - i).classList.add("selected-alt");
            }
            const elem = document.querySelector(`li.dx${x}y${y-i+1}`);
            if (elem) {
                elem.classList.add("selected");
            }
        }
    },
    updateNumbers() {
        document.querySelectorAll(".cell .number").forEach(el => el.textContent = "");
        // Down
        let down = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (getElem(x, y) === null) continue;
                if (y === 0 || getElem(x, y - 1) === null) {
                    let length = 1;
                    while (length <= this.size && getElem(x, y + length) !== null) {
                        length++;
                    }
                    if (length > 1) {
                        down.push({x, y, length});
                    }
                }
            }
        }

        // Across
        let across = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (getElem(x, y) === null) continue;
                if (x === 0 || getElem(x - 1, y) === null) {
                    let length = 1;
                    while (length <= this.size && getElem(x + length, y) !== null) {
                        length++;
                    }
                    if (length > 1) {
                        across.push({x, y, length});
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
                    getElem(currentDown.x, currentDown.y).querySelector(".number").textContent = clueNumber;
                    currentAcross.number = clueNumber;
                    currentDown.number = clueNumber;
                    clueNumber++;
                    i++;
                    j++;
                    continue;
                }

                if (currentDown.x < currentAcross.x) {
                    getElem(currentDown.x, currentDown.y).querySelector(".number").textContent = clueNumber;
                    currentDown.number = clueNumber;
                    clueNumber++;
                    i++;
                    continue;

                }
            }
            if (currentDown.y < currentAcross.y) {
                getElem(currentDown.x, currentDown.y).querySelector(".number").textContent = clueNumber;
                currentDown.number = clueNumber;
                clueNumber++;
                i++;
                continue;
            }
            getElem(currentAcross.x, currentAcross.y).querySelector(".number").textContent = clueNumber;
            currentAcross.number = clueNumber;
            clueNumber++;
            j++;
        }
        document.querySelector(".clue-count.across").textContent = `(${across.length})`;
        document.querySelector(".clue-count.down").textContent = `(${down.length})`;
        document.querySelector(".clues.across").innerHTML = across.map(el => `<li class="ax${el.x}y${el.y}">${el.number}. <textarea></textarea> (${el.length})</li>`).join('');
        document.querySelector(".clues.down").innerHTML = down.map(el => `<li class="dx${el.x}y${el.y}">${el.number}. <textarea></textarea> (${el.length})</li>`).join('');
    },
    next() {
        if (this.direction === "across") {
            this.x += 1;
        } else if (this.direction === "down") {
            this.y += 1;
        }
        while (true) {
            if (this.x >= this.size) {
                this.x = 0;
                if (this.direction === "across") {
                    this.y += 1;
                }
                continue;
            }
            if (this.y >= this.size) {
                this.y = 0;
                if (this.direction === "down") {
                    this.x += 1;
                }
                continue;
            }
            if (this.elem() === null) {
                this.next();
            }
            break;
        }
        this.update();
    },
    prev() {
        if (this.direction === "across") {
            this.x -= 1;
        } else if (this.direction === "down") {
            this.y -= 1;
        }
        while (true) {
            if (this.x < 0) {
                this.x = this.size - 1;
                if (this.direction === "across") {
                    this.y -= 1;
                }
                continue;
            }
            if (this.y < 0) {
                this.y = this.size - 1;
                if (this.direction === "down") {
                    this.x -= 1;
                }
                continue;
            }
            if (this.elem() === null) {
                this.prev();
            }
            break;
        }
        this.update();
    },
    flip() {
        this.direction = this.direction === "across" ? "down" : "across";
    },
    elem() {
        return uncheckedGetElem(this.x, this.y);
    },
    create(size) {
        this.x = 0;
        this.y = 0;
        this.size = size;
        const table = document.querySelector(".crossword");
        let out = "";
        for (let y = 0; y < size; y++) {
            out += "<tr>";
            for (let x = 0; x < size; x++) {
                out += `<td class=\"cell x${x}y${y}\" onclick="handleClick(${x}, ${y})"><div class="number"></div><div class="value"></div></td>`;
            }
            out += "</tr>";
        }
        table.innerHTML = out;
    },
    load(code) {
        let size = parseInt(code.split(";")[0]);
        this.create(size);
        let s = code.split(";")[1];
        let i = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const elem = getElem(x, y);
                if (s[i] === "-") {
                    elem.classList.add("black");
                } else if (s[i] === "_") {
                    elem.querySelector(".value").textContent = "";
                } else {
                    elem.querySelector(".value").textContent = s[i];
                }
                i += 1;
            }
        }
        this.updateNumbers();
        this.update();
        let across = code.split(";")[2].split(",");
        for (let i = 0; i < across.length; i++) {
            if (across[i]) {
                document.querySelector(".clues.across").children[i].querySelector("textarea").value = across[i];
            }
        }
        let down = code.split(";")[3].split(",");
        for (let i = 0; i < down.length; i++) {
            if (down[i]) {
                document.querySelector(".clues.down").children[i].querySelector("textarea").value = down[i];
            }
        }
    },
    load2(code) {
        let puzzle = JSON.parse(code);
        this.create(puzzle.size);
        let s = puzzle.grid;
        let i = 0;
        for (let y = 0; y < puzzle.size; y++) {
            for (let x = 0; x < puzzle.size; x++) {
                const elem = document.querySelector(`.x${x}y${y}`);
                if (s[i] === "-") {
                    elem.classList.add("black");
                } else if (s[i] === "_") {
                    elem.querySelector(".value").textContent = "";
                } else {
                    elem.querySelector(".value").textContent = s[i];
                }
                i += 1;
            }
        }
        this.updateNumbers();
        this.update();
        let across = puzzle.across;
        for (let i = 0; i < across.length; i++) {
            if (across[i]) {
                document.querySelector(".clues.across").children[i].querySelector("textarea").value = across[i];
            }
        }
        let down = puzzle.down;
        for (let i = 0; i < down.length; i++) {
            if (down[i]) {
                document.querySelector(".clues.down").children[i].querySelector("textarea").value = down[i];
            }
        }
    },
    save() {
        let raw = "";
        raw += this.size + ";";
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const elem = document.querySelector(`.x${x}y${y}`);
                if (elem.classList.contains("black")) {
                    raw += "-";
                } else if (elem.querySelector(".value").textContent === "") {
                    raw += "_";
                } else {
                    raw += elem.querySelector(".value").textContent;
                }
            }
        }
        raw += ";";
        document.querySelectorAll(".clues.across li textarea").forEach(el => {
            raw += el.value + ",";
        });
        raw += ";";
        document.querySelectorAll(".clues.down li textarea").forEach(el => {
            raw += el.value + ",";
        });
        return raw;
    },
    save2() {
        let output = {
            size: this.size,
        };
        let grid = "";
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const elem = document.querySelector(`.x${x}y${y}`);
                if (elem.classList.contains("black")) {
                    grid += "-";
                } else if (elem.querySelector(".value").textContent === "") {
                    grid += "_";
                } else {
                    grid += elem.querySelector(".value").textContent;
                }
            }
        }
        output.grid = grid;
        let across = [];
        document.querySelectorAll(".clues.across li textarea").forEach(el => {
            across.push(el.value);
        });
        let down = [];
        document.querySelectorAll(".clues.down li textarea").forEach(el => {
            down.push(el.value);
        });
        output.across = across;
        output.down = down;
        return JSON.stringify(output);
    },
};

function getElem(x, y) {
    const e = uncheckedGetElem(x, y);
    if (e === null || e.classList.contains("black")) {
        return null;
    }
    return e;
}

function uncheckedGetElem(x, y) {
    return document.querySelector(`.cell.x${x}y${y}`);
}

function handleKeyPress(e) {
    if (e.ctrlKey) return;
    if (document.activeElement !== document.body) return;
    const {code, key} = e;
    if (key.length === 1 && (/[a-zA-Z]/).test(key)) {
        selected.elem().querySelector(".value").textContent = key;
        selected.next();
    } else if (code === "Backspace") {
        const elem = selected.elem();
        if (elem.querySelector(".value").textContent === "") {
            selected.prev();
        }
        selected.elem().querySelector(".value").textContent = "";
    } else if (code === "Delete") {
        selected.elem().querySelector(".value").textContent = "";
    } else if (code === "Minus") {
        const elem = selected.elem();
        elem.classList.toggle("black");
        if (elem.classList.contains("black")) {
            elem.querySelector(".value").textContent = "";
        }
        selected.updateNumbers();
        selected.update();
    } else if (code === "ArrowLeft") {
        selected.prev();
    } else if (code === "ArrowRight") {
        selected.next();
    } else if (code === "ArrowUp") {
        selected.y = (selected.y - 1 + selected.size) % selected.size;
        selected.update();
    } else if (code === "ArrowDown") {
        selected.y = (selected.y + 1 + selected.size) % selected.size;
        selected.update();
    } else if (code === "Space") {
        selected.flip();
    }
}

function handleClick(x, y) {
    if (selected.x === x && selected.y === y) {
        selected.flip();
    } else {
        selected.x = x;
        selected.y = y;
    }
    selected.update();
}

function handleSave() {
    const code = selected.save2();
    console.log(code);
    // alert(code);
    window.localStorage.setItem("default", code);
}

function handleNew() {
    const size = parseInt(prompt("Enter size:"));
    if (size >= 2 && size < 50) {
        selected.create(size);
        selected.updateNumbers();
        selected.update();
    }
}

function handleLoad() {
    const code = prompt("Enter crossword code:");
    selected.load2(code);
}

function toggleEditMode() {
    document.querySelectorAll(".clues li").forEach(el => {
        console.log("Test");
        console.log(el.innerHTML);
        el.innerHTML = el.innerHTML.replace("<textarea></textarea>", el.querySelector("textarea").value); 
    });
}

function clearGrid() {
    document.querySelectorAll(".cell .value").forEach(el => el.textContent = "");
}

function loadLocalStorage() {
    selected.load2(window.localStorage.getItem("default"));
}

function onload() {
    selected.create(9);
    document.addEventListener("keydown", handleKeyPress);
    document.querySelector(".new").addEventListener("click", handleNew);
    document.querySelector(".save").addEventListener("click", handleSave);
    document.querySelector(".load").addEventListener("click", handleLoad);
    document.querySelector(".toggle-edit").addEventListener("click", toggleEditMode);
    document.querySelector(".clear").addEventListener("click", clearGrid);
    loadLocalStorage();
}
