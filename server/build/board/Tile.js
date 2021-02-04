"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardUtils_1 = __importDefault(require("./BoardUtils"));
class Tile {
    constructor(position, piece) {
        this.position = position;
        this.piece = piece;
    }
    getBoardCode() {
        return BoardUtils_1.default.getBoardCode(this.position);
    }
    isOccupied() {
        return this.piece !== null;
    }
    isEmpty() {
        return this.piece === null;
    }
    setPiece(piece) {
        this.piece = piece;
    }
    clearPiece() {
        this.piece = null;
    }
    getPiece() {
        return this.piece;
    }
    /**
     * * COPY
     */
    copy() {
        var _a;
        return new Tile(this.position, ((_a = this.piece) === null || _a === void 0 ? void 0 : _a.copy()) || null);
    }
}
exports.default = Tile;
//# sourceMappingURL=Tile.js.map