"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = __importDefault(require("../board/Piece"));
const Rook_1 = __importDefault(require("./Rook"));
const BoardUtils_1 = __importDefault(require("../board/BoardUtils"));
class King extends Piece_1.default {
    constructor(position, team, history) {
        super(position, team, history);
        this.directions = [-9, -8, -7, -1, 1, 7, 8, 9];
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
        if (this.getHistory().length === 0) {
            const Lrook = board.getTile(this.getPosition() - 4).getPiece();
            const Rrook = board.getTile(this.getPosition() + 3).getPiece();
            const getMove = (destination) => ({
                type: "Shift",
                predator: this.getBoardCode(),
                destination: BoardUtils_1.default.getBoardCode(destination)
            });
            let pieceBetween = false;
            if (Lrook instanceof Rook_1.default && Lrook.getHistory().length === 0) {
                for (let i = -1; i > -4; i--) {
                    if (board.getTile(this.getPosition() + i).isOccupied()) {
                        pieceBetween = true;
                    }
                }
                if (!pieceBetween) {
                    const one = getMove(this.getPosition() - 1);
                    const two = getMove(this.getPosition() - 2);
                    const oneSafe = this.getTeam().isKingSafe(board.execute(one));
                    const twoSafe = this.getTeam().isKingSafe(board.execute(two));
                    if (oneSafe && twoSafe) {
                        moves.push({
                            type: "Castle",
                            predator: this.getBoardCode(),
                            destination: BoardUtils_1.default.getBoardCode(this.getPosition() - 2)
                        });
                    }
                }
            }
            pieceBetween = false;
            if (Rrook instanceof Rook_1.default && Rrook.getHistory().length === 0) {
                for (let i = 1; i < 3; i++) {
                    if (board.getTile(this.getPosition() + i).isOccupied()) {
                        pieceBetween = true;
                    }
                }
                if (!pieceBetween) {
                    const one = getMove(this.getPosition() + 1);
                    const two = getMove(this.getPosition() + 2);
                    const oneSafe = this.getTeam().isKingSafe(board.execute(one));
                    const twoSafe = this.getTeam().isKingSafe(board.execute(two));
                    if (oneSafe && twoSafe) {
                        moves.push({
                            type: "Castle",
                            predator: this.getBoardCode(),
                            destination: BoardUtils_1.default.getBoardCode(this.getPosition() + 2)
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
        const invalidOffsets = [7, -1, -9];
        return (BoardUtils_1.default.IN_FIRST_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    EighthColException(position, offset) {
        const invalidOffsets = [-7, 1, 9];
        return (BoardUtils_1.default.IN_EIGHTH_COL(position) &&
            invalidOffsets.indexOf(offset) >= 0);
    }
    getTeamSpecificPoint() {
        // prettier-ignore
        const points = [
            -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,
            -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,
            -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,
            -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,
            -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0,
            -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0,
            2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0,
            2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0,
        ];
        // prettier-ignore-stop
        return this.getTeam().getString() === "white"
            ? points[this.getPosition()]
            : points.reverse()[this.getPosition()];
    }
    getPoints() {
        return ((1000 + this.getTeamSpecificPoint()) * this.getTeam().getDirection());
    }
    /**
     * * COPY
     */
    copy() {
        return new King(this.getPosition(), this.getTeam(), JSON.parse(JSON.stringify(this.getHistory())));
    }
    /**
     * : Development methods
     */
    getString() {
        return this.getTeam().getString() === "white" ? "K" : "k";
    }
}
exports.default = King;
//# sourceMappingURL=King.js.map