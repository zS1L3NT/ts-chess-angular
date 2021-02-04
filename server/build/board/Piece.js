"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardUtils_1 = __importDefault(require("./BoardUtils"));
class Piece {
    constructor(position, team, history) {
        this.position = position;
        this.team = team;
        this.history = history;
    }
    getBoardCode() {
        return BoardUtils_1.default.getBoardCode(this.position);
    }
    /**
     *
     * @time 0.1ms ~ 7ms
     * @param board Board
     */
    getSafeMoves(board) {
        // const t = new Timer("getSafeMoves")
        const legalMoves = this.getLegalMoves(board);
        const moves = [];
        for (let i = 0, il = legalMoves.length; i < il; i++) {
            const move = legalMoves[i];
            if (this.getTeam().isKingSafe(board.execute(move))) {
                moves.push(move);
            }
        }
        // t.stop()
        return moves;
    }
    setPosition(position) {
        this.history.push(BoardUtils_1.default.getBoardCode(this.position));
        this.position = position;
    }
    getHistory() {
        return this.history;
    }
    getPosition() {
        return this.position;
    }
    getTeam() {
        return this.team;
    }
}
exports.default = Piece;
//# sourceMappingURL=Piece.js.map