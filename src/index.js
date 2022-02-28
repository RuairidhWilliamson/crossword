import Crossword from "./crossword";
import Editor from "./editor";
import View from "./view";

const crossword = new Crossword(15);
const editor = new Editor();
editor.crossword = crossword;
const view = new View(editor);
editor.view = view;
crossword.view = view;
view.update();

function handleKeyDown(e) {
    if (document.activeElement !== document.body) return;
    editor.handleKeyDown(e);
}

function handleNew() {
    const size = prompt("What size?");
    crossword.new(size);
    view.update();
    view.updateClues();
}

function handleSave() {
    const code = crossword.save();
    console.log(code);
    navigator.clipboard.writeText(code);
    localStorage.setItem("default", code);
    alert("Saved to clipboard and localstorage");
}

function handleLoad() {
    const code = prompt("Enter code");
    if (code) {
        crossword.load(code);
    }
}

function loadLocalStorage() {
    const code = localStorage.getItem("default");
    if (code) {
        crossword.load(code);
    }
}

function toggleEditMode() {
    editor.toggleEditMode();
}

function clearGrid() {
    editor.clearGrid();
}

document.addEventListener("keydown", handleKeyDown);

document.querySelector(".new").addEventListener("click", handleNew);
document.querySelector(".save").addEventListener("click", handleSave);
document.querySelector(".load").addEventListener("click", handleLoad);
document.querySelector(".toggle-edit").addEventListener("click", toggleEditMode);
document.querySelector(".clear").addEventListener("click", clearGrid);

loadLocalStorage();