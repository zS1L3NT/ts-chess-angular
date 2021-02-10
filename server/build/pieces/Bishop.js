"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardUtils_1 = __importDefault(require("../board/BoardUtils"));
const Piece_1 = __importDefault(require("../board/Piece"));
class Bishop extends Piece_1.default {
    constructor(position, team, history) {
        super(position, team, history);
        this.directions = [-9, -7, 7, 9];
    }
    getLegalMoves(board) {
        const moves = [];
        for (let i = 0, il = this.directions.length; i < il; i++) {
            const offset = this.directions[i];
            var testPosition = this.getPosition();
            while (BoardUtils_1.default.isValidPosition(testPosition)) {
                if (this.ColExceptions(testPosition, offset))
                    break;
                testPosition += offset;
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
                        break;
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
        }
        return moves;
    }
    ColExceptions(position, offset) {
        return (this.FirstColException(position, offset) ||
            this.EighthColException(position, offset));
    }
    FirstColException(position, offset) {
        const invalidOffsets = [-9, 7];
        return (BoardUtils_1.default.IN_FIRST_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    EighthColException(position, offset) {
        const invalidOffsets = [9, -7];
        return (BoardUtils_1.default.IN_EIGHTH_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    getTeamSpecificPoint() {
        // prettier-ignore
        const points = [
            -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0,
            -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0,
            -1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0,
            -1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0,
            -1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0,
            -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
            -1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0,
            -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0
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
        return new Bishop(this.getPosition(), this.getTeam(), JSON.parse(JSON.stringify(this.getHistory())));
    }
    getString() {
        return this.getTeam().getString() === "white" ? "B" : "b";
    }
}
exports.default = Bishop;
//# sourceMappingURL=Bishop.js.map