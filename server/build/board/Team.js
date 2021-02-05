"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _interfaces_1 = require("../_interfaces");
const King_1 = __importDefault(require("../pieces/King"));
const BoardUtils_1 = __importDefault(require("./BoardUtils"));
class Team {
    constructor(team) {
        this.team = team;
    }
    getString() {
        return this.team;
    }
    getBestScore(scores) {
        return this.team === "white" ? Math.min(...scores) : Math.max(...scores);
    }
    isWhite() {
        return this.team === "white";
    }
    isBlack() {
        return this.team === "black";
    }
    getDirection() {
        return this.team === "white" ? -1 : 1;
    }
    getEnemy() {
        return this.getString() === "white"
            ? new Team("black")
            : new Team("white");
    }
    /**
     * @time 20mcs ~ 400mcs
     * @param board Board
     */
    getKingPosition(board) {
        // const t = new Timer("getKingPosition")
        for (let i = 0; i < 64; i++) {
            const tile = board.getTile(i);
            if (tile.isEmpty())
                continue;
            const piece = tile.getPiece();
            if (piece.getTeam().getString() !== this.getString())
                continue;
            if (piece instanceof King_1.default) {
                // t.stop()
                return piece.getPosition();
            }
        }
        throw new _interfaces_1.DetailedError("King not found???", board.printable());
    }
    /**
     * @time 1ms ~ 5ms
     * @param board Board
     */
    getAllLegalMoves(board) {
        // const t = new Timer("getAllLegalMoves")
        const moves = [];
        for (let i = 0; i < 64; i++) {
            const tile = board.getTile(i);
            if (tile.isEmpty())
                continue;
            if (tile.getPiece().getTeam().getString() !== this.getString())
                continue;
            const legalMoves = tile.getPiece().getLegalMoves(board);
            if (legalMoves.length === 0)
                continue;
            for (let j = 0; j < legalMoves.length; j++) {
                moves.push(legalMoves[j]);
            }
        }
        // t.stop()
        return moves;
    }
    /**
     * @time 1ms ~ 40ms
     * @param board BoardUtils
     */
    isKingSafe(board) {
        // const t = new Timer("isKingSafe")
        const enemy = this.getString() === "white" ? new Team("black") : new Team("white");
        const allLegalMoves = enemy.getAllLegalMoves(board);
        const kingBoardCode = BoardUtils_1.default.getBoardCode(this.getKingPosition(board));
        for (let i = 0, il = allLegalMoves.length; i < il; i++) {
            const move = allLegalMoves[i];
            if (move.destination === kingBoardCode) {
                return false;
            }
        }
        // t.stop()
        return true;
    }
    /**
     * @time 500mcs ~ 30ms
     * @param board Board
     */
    getAllSafeMoves(board) {
        // const t = new Timer("getAllSafeMoves")
        const moves = [];
        for (let i = 0; i < 64; i++) {
            const tile = board.getTile(i);
            if (tile.isEmpty())
                continue;
            if (tile.getPiece().getTeam().getString() !== this.getString())
                continue;
            const safeMoves = tile.getPiece().getSafeMoves(board);
            for (let j = 0; j < safeMoves.length; j++) {
                moves.push(safeMoves[j]);
            }
        }
        // t.stop()
        return moves;
    }
}
exports.default = Team;
//# sourceMappingURL=Team.js.map