"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _interfaces_1 = require("../_interfaces");
const Bishop_1 = __importDefault(require("../pieces/Bishop"));
const King_1 = __importDefault(require("../pieces/King"));
const Knight_1 = __importDefault(require("../pieces/Knight"));
const Pawn_1 = __importDefault(require("../pieces/Pawn"));
const Queen_1 = __importDefault(require("../pieces/Queen"));
const Rook_1 = __importDefault(require("../pieces/Rook"));
const Team_1 = __importDefault(require("./Team"));
const Tile_1 = __importDefault(require("./Tile"));
class BoardUtils {
    static getBoardCode(position) {
        if (!this.isValidPosition(position)) {
            throw new _interfaces_1.DetailedError(`Position (${position}) is not valid`);
        }
        const letter = [..."ABCDEFGH"][position % 8];
        const number = (8 - ((position / 8) << 0)) << 0;
        return letter + number;
    }
    static getPosition(boardCode) {
        if (!this.isValidBoardCode(boardCode)) {
            throw new _interfaces_1.DetailedError(`Board Code ${boardCode} is not valid`);
        }
        const letter = boardCode[0];
        const number = +boardCode[1];
        return (8 - number) * 8 + [..."ABCDEFGH"].indexOf(letter);
    }
    static IN_FIRST_COL(position) {
        return this.range(0, 56, 8).indexOf(position) >= 0;
    }
    static IN_SECOND_COL(position) {
        return this.range(1, 57, 8).indexOf(position) >= 0;
    }
    static IN_SEVENTH_COL(position) {
        return this.range(6, 62, 8).indexOf(position) >= 0;
    }
    static IN_EIGHTH_COL(position) {
        return this.range(7, 63, 8).indexOf(position) >= 0;
    }
    static IN_SECOND_ROW(position) {
        return this.range(8, 15, 1).indexOf(position) >= 0;
    }
    static IN_FOURTH_ROW(position) {
        return this.range(24, 31, 1).indexOf(position) >= 0;
    }
    static IN_FIFTH_ROW(position) {
        return this.range(32, 39, 1).indexOf(position) >= 0;
    }
    static IN_SEVENTH_ROW(position) {
        return this.range(48, 55, 1).indexOf(position) >= 0;
    }
    static range(start, stop, step) {
        return [...Array(Math.floor((stop - start) / step) + 1)].map((_, i) => start + i * step);
    }
    static isValidBoardCode(boardCode) {
        return !!boardCode.match(/^[A-H][1-8]$/);
    }
    static isValidPosition(position) {
        return position >= 0 && position < 64;
    }
    /**
     * : Development Methods
     */
    static initialBoard() {
        let map = [
            new Tile_1.default(0, new Rook_1.default(0, new Team_1.default("black"), [])),
            new Tile_1.default(1, new Knight_1.default(1, new Team_1.default("black"), [])),
            new Tile_1.default(2, new Bishop_1.default(2, new Team_1.default("black"), [])),
            new Tile_1.default(3, new Queen_1.default(3, new Team_1.default("black"), [])),
            new Tile_1.default(4, new King_1.default(4, new Team_1.default("black"), [])),
            new Tile_1.default(5, new Bishop_1.default(5, new Team_1.default("black"), [])),
            new Tile_1.default(6, new Knight_1.default(6, new Team_1.default("black"), [])),
            new Tile_1.default(7, new Rook_1.default(7, new Team_1.default("black"), []))
        ];
        for (let i = 8; i < 16; i++) {
            map.push(new Tile_1.default(i, new Pawn_1.default(i, new Team_1.default("black"), [])));
        }
        for (let i = 16; i < 48; i++) {
            map.push(new Tile_1.default(i, null));
        }
        for (let i = 48; i < 56; i++) {
            map.push(new Tile_1.default(i, new Pawn_1.default(i, new Team_1.default("white"), [])));
        }
        map = map.concat([
            new Tile_1.default(56, new Rook_1.default(56, new Team_1.default("white"), [])),
            new Tile_1.default(57, new Knight_1.default(57, new Team_1.default("white"), [])),
            new Tile_1.default(58, new Bishop_1.default(58, new Team_1.default("white"), [])),
            new Tile_1.default(59, new Queen_1.default(59, new Team_1.default("white"), [])),
            new Tile_1.default(60, new King_1.default(60, new Team_1.default("white"), [])),
            new Tile_1.default(61, new Bishop_1.default(61, new Team_1.default("white"), [])),
            new Tile_1.default(62, new Knight_1.default(62, new Team_1.default("white"), [])),
            new Tile_1.default(63, new Rook_1.default(63, new Team_1.default("white"), []))
        ]);
        return map;
    }
}
exports.default = BoardUtils;
//# sourceMappingURL=BoardUtils.js.map