import { Direction } from "./types";

export default class Clue {
    x: number;
    y: number;
    direction: Direction;
    clue: string;
    length: number;
    index: number;
    
    constructor(x: number, y: number, direction: Direction, length: number) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.length = length;
    }
}