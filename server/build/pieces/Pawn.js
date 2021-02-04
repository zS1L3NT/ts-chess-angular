"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardUtils_1 = __importDefault(require("../board/BoardUtils"));
const Piece_1 = __importDefault(require("../board/Piece"));
class Pawn extends Piece_1.default {
    constructor(position, team, history) {
        super(position, team, history);
        this.directions = [7, 8, 9, 16];
        this.promotes = [
            "Queen",
            "Rook",
            "Bishop",
            "Knight"
        ];
    }
    getLegalMoves(board) {
        const moves = [];
        for (let i = 0, il = this.directions.length; i < il; i++) {
            const offset = this.directions[i];
            const testPosition = this.getPosition() + offset * this.getTeam().getDirection();
            if (!BoardUtils_1.default.isValidPosition(testPosition))
                continue;
            const tile = board.getTile(testPosition);
            if (offset === 8 && tile.isEmpty()) {
                /**
                 * * Single forward
                 * * Promotable
                 */
                if (this.PromotionException()) {
                    for (let i = 0, il = 4; i < il; i++) {
                        const promote = this.promotes[i];
                        moves.push({
                            type: "Promote",
                            predator: this.getBoardCode(),
                            destination: tile.getBoardCode(),
                            promote
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
            else if (offset === 16 && this.getHistory().length === 0) {
                /**
                 * * Double forward
                 */
                const tileBetween = board.getTile(this.getPosition() + 8 * this.getTeam().getDirection());
                if (tileBetween.isEmpty() && tile.isEmpty()) {
                    moves.push({
                        type: "Shift",
                        predator: this.getBoardCode(),
                        destination: tile.getBoardCode()
                    });
                }
            }
            else if ((offset === 7 && !this.SevenException()) ||
                (offset === 9 && !this.NineException())) {
                /**
                 * * Sideways attacks
                 * * Promotable
                 */
                if (tile.isOccupied() &&
                    tile.getPiece().getTeam().getString() !==
                        this.getTeam().getString()) {
                    if (this.PromotionException()) {
                        for (let i = 0, il = 4; i < il; i++) {
                            const promote = this.promotes[i];
                            moves.push({
                                type: "Promote",
                                predator: this.getBoardCode(),
                                destination: tile.getBoardCode(),
                                prey: tile.getBoardCode(),
                                promote
                            });
                        }
                    }
                    else {
                        moves.push({
                            type: "Attack",
                            predator: this.getBoardCode(),
                            destination: tile.getBoardCode(),
                            prey: tile.getBoardCode()
                        });
                    }
                }
            }
            if (this.PredatorEnPassantException()) {
                // In row ready for en passant
                const Lpawn = board
                    .getTile(this.getPosition() + this.getTeam().getDirection())
                    .getPiece();
                const Rpawn = board
                    .getTile(this.getPosition() - this.getTeam().getDirection())
                    .getPiece();
                if (!this.NineException() &&
                    offset === 7 &&
                    Lpawn instanceof Pawn) {
                    const destination = BoardUtils_1.default.getBoardCode(this.getPosition() + 9 * this.getTeam().getDirection());
                    if (board.epts === destination) {
                        moves.push({
                            type: "EnPassant",
                            predator: this.getBoardCode(),
                            destination,
                            prey: Lpawn.getBoardCode()
                        });
                    }
                }
                if (!this.SevenException() &&
                    offset === 9 &&
                    Rpawn instanceof Pawn) {
                    const destination = BoardUtils_1.default.getBoardCode(this.getPosition() + 7 * this.getTeam().getDirection());
                    if (board.epts === destination) {
                        moves.push({
                            type: "EnPassant",
                            predator: this.getBoardCode(),
                            destination,
                            prey: Rpawn.getBoardCode()
                        });
                    }
                }
            }
        }
        return moves;
    }
    SevenException() {
        return ((BoardUtils_1.default.IN_EIGHTH_COL(this.getPosition()) &&
            this.getTeam().isWhite()) ||
            (BoardUtils_1.default.IN_FIRST_COL(this.getPosition()) &&
                this.getTeam().isBlack()));
    }
    NineException() {
        return ((BoardUtils_1.default.IN_FIRST_COL(this.getPosition()) &&
            this.getTeam().isWhite()) ||
            (BoardUtils_1.default.IN_EIGHTH_COL(this.getPosition()) &&
                this.getTeam().isBlack()));
    }
    PromotionException() {
        return ((this.getTeam().isBlack() &&
            BoardUtils_1.default.IN_SEVENTH_ROW(this.getPosition())) ||
            (this.getTeam().isWhite() &&
                BoardUtils_1.default.IN_SECOND_ROW(this.getPosition())));
    }
    PredatorEnPassantException() {
        return ((this.getTeam().isWhite() &&
            BoardUtils_1.default.IN_FOURTH_ROW(this.getPosition())) ||
            (this.getTeam().isBlack() &&
                BoardUtils_1.default.IN_FIFTH_ROW(this.getPosition())));
    }
    getTeamSpecificPoint() {
        // prettier-ignore
        const points = [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0,
            1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0,
            0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0,
            0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5,
            0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ];
        // prettier-ignore-stop
        return this.getTeam().getString() === "white"
            ? points[this.getPosition()]
            : points.reverse()[this.getPosition()];
    }
    getPoints() {
        return ((10 + this.getTeamSpecificPoint()) * this.getTeam().getDirection());
    }
    /**
     * * COPY
     */
    copy() {
        return new Pawn(this.getPosition(), this.getTeam(), JSON.parse(JSON.stringify(this.getHistory())));
    }
    /**
     * : Development methods
     */
    getString() {
        return this.getTeam().getString() === "white" ? "P" : "p";
    }
}
exports.default = Pawn;
//# sourceMappingURL=Pawn.js.map