"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = __importDefault(require("../board/Piece"));
const BoardUtils_1 = __importDefault(require("../board/BoardUtils"));
class Knight extends Piece_1.default {
    constructor(position, team, history) {
        super(position, team, history);
        this.directions = [-10, -17, -15, -6, 10, 17, 15, 6];
    }
    getLegalMoves(board) {
        const moves = [];
        for (let i = 0, il = this.directions.length; i < il; i++) {
            const offset = this.directions[i];
            const testPosition = this.getPosition() + offset;
            if (this.ColExceptions(this.getPosition(), offset))
                continue;
            if (BoardUtils_1.default.isValidPosition(testPosition)) {
                const tile = board.getTile(testPosition);
                if (tile.isOccupied()) {
                    const piece = tile.getPiece();
                    if (piece.getTeam().getString() !==
                        this.getTeam().getString()) {
                        moves.push({
                            type: "Attack",
                            predator: this.getBoardCode(),
                            destination: piece.getBoardCode(),
                            prey: piece.getBoardCode()
                        });
                    }
                }
                else {
                    moves.push({
                        type: "Shift",
                        predator: this.getBoardCode(),
                        destination: tile.getBoardCode()
                    });
                }
            }
        }
        return moves;
    }
    ColExceptions(position, offset) {
        return (this.FirstColException(position, offset) ||
            this.SecondColException(position, offset) ||
            this.SeventhColException(position, offset) ||
            this.EighthColException(position, offset));
    }
    FirstColException(position, offset) {
        const invalidOffsets = [-10, -17, 15, 6];
        return (BoardUtils_1.default.IN_FIRST_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    SecondColException(position, offset) {
        const invalidOffsets = [-10, 6];
        return (BoardUtils_1.default.IN_SECOND_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    SeventhColException(position, offset) {
        const invalidOffsets = [10, -6];
        return (BoardUtils_1.default.IN_SEVENTH_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    EighthColException(position, offset) {
        const invalidOffsets = [10, 17, -15, -6];
        return (BoardUtils_1.default.IN_EIGHTH_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    getTeamSpecificPoint() {
        // prettier-ignore
        const points = [
            -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0,
            -4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0,
            -3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0,
            -3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0,
            -3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0,
            -3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0,
            -4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0,
            -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0
        ];
        // prettier-ignore-stop
        return this.getTeam().getString() === "white"
            ? points[this.getPosition()]
            : points.reverse()[this.getPosition()];
    }
    getPoints() {
        return ((30 + this.getTeamSpecificPoint()) * this.getTeam().getDirection());
    }
    /**
     * * COPY
     */
    copy() {
        return new Knight(this.getPosition(), this.getTeam(), JSON.parse(JSON.stringify(this.getHistory())));
    }
    /**
     * : Development methods
     */
    getString() {
        return this.getTeam().getString() === "white" ? "N" : "n";
    }
}
exports.default = Knight;
//# sourceMappingURL=Knight.js.map