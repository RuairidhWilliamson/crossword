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
}

function handleSave() {
    const code = crossword.save();
    console.log(code);
    localStorage.setItem("default", code);
}

function handleLoad() {
    const code = localStorage.getItem("default");
    crossword.load(code);
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

handleLoad();