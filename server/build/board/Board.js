"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Move_1 = require("./Move");
const Team_1 = __importDefault(require("./Team"));
const _interfaces_1 = require("../_interfaces");
class Board {
    constructor(epts, tiles) {
        this.board = [];
        this.epts = epts;
        for (let i = 0; i < 64; i++) {
            this.board[i] = tiles[i];
        }
    }
    execute(move) {
        const tilesCopy = [];
        for (let i = 0, il = this.board.length; i < il; i++) {
            const tile = this.board[i];
            tilesCopy.push(tile.copy());
        }
        const boardCopy = new Board(this.epts, tilesCopy);
        switch (move.type) {
            case "Shift":
                Move_1.ExecuteShift(move, boardCopy);
                break;
            case "Attack":
                Move_1.ExecuteAttack(move, boardCopy);
                break;
            case "Castle":
                Move_1.ExecuteCastle(move, boardCopy);
                break;
            case "EnPassant":
                Move_1.ExecuteEnPassant(move, boardCopy);
                break;
            case "Promote":
                Move_1.ExecutePromote(move, boardCopy);
                break;
            default:
                throw new _interfaces_1.DetailedError(`Invalid move type (${move.type})`, move);
        }
        boardCopy.epts = "";
        return boardCopy;
    }
    getTile(position) {
        return this.board[position];
    }
    getPoints() {
        let count = 0;
        const white = new Team_1.default("white");
        const black = new Team_1.default("black");
        if (white.getAllSafeMoves(this).length === 0 &&
            !white.isKingSafe(this)) {
            return Infinity;
        }
        else if (black.getAllSafeMoves(this).length === 0 &&
            !black.isKingSafe(this)) {
            return -Infinity;
        }
        for (let i = 0, il = this.board.length; i < il; i++) {
            const tile = this.board[i];
            const piece = tile.getPiece();
            if (piece)
                count += piece.getPoints();
        }
        return count;
    }
    /**
     * : Development methods
     */
    printable() {
        const numbers = [...'87654321'];
        let string = `\n     A   B   C   D   E   F   G   H\n`;
        string += `   ${"+---".repeat(8)}+\n`;
        for (let i = 0; i < 8; i++) {
            string += ` ${numbers[i]} `;
            for (let j = 0; j < 8; j++) {
                const position = i * 8 + j;
                const piece = this.board[position].getPiece();
                string += "| " + (piece ? piece.getString() : " ") + " ";
            }
            string += `|\n   ${"+---".repeat(8)}+\n`;
        }
        return string;
    }
    print() {
        console.log(this.printable());
    }
}
exports.default = Board;
//# sourceMappingURL=Board.js.map