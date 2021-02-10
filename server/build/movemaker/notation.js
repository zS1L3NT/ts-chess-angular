"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardUtils_1 = __importDefault(require("../board/BoardUtils"));
const _interfaces_1 = require("../_interfaces");
class Notation {
    constructor(board, move) {
        /*******************************
         * Determines the initial statement of code.
         */
        this.predator = "";
        /*******************************
         * Checks if predator code needs to be unique.
         * For example:
         * Qd
         * Q4
         * Qd4
         */
        this.fileRankBoardCode = "";
        /*******************************
         * Adds "x" if necessary.
         */
        this.attacking = false;
        /*******************************
         * Writes destination of piece
         */
        this.destination = "";
        /******************************
         * Promotes
         */
        this.promotes = "";
        /*******************************
         * See if King is checked
         */
        this.checks = false;
        /*******************************
         * See if King is checkmated
         */
        this.mates = false;
        this.board = board;
        this.move = move;
    }
    getString() {
        if (this.move.type === "Castle")
            return this.typeCastle();
        if (this.move.prey)
            this.attacking = true;
        if (this.move.promote)
            this.promotes = this.move.promote[0];
        const position = this.move.predator;
        const predator = this.board
            .getTile(BoardUtils_1.default.getPosition(position))
            .getPiece();
        if (!predator)
            throw new _interfaces_1.DetailedError(`Move has no predator on board`, this.board.printable(), this.move);
        const enemy = predator.getTeam().getEnemy();
        const testBoard = this.board.execute(this.move);
        if (!enemy.isKingSafe(testBoard)) {
            if (enemy.getAllSafeMoves(testBoard).length === 0) {
                this.mates = true;
            }
            else {
                this.checks = true;
            }
        }
        const destination = this.move.destination;
        this.predator = predator.getString();
        this.destination = destination;
        /******************************
         * Test for identical piece type and move
         */
        // Identical pieces with the same move
        const identicalMovePieces = [];
        for (let i = 0; i < 64; i++) {
            const piece = this.board.getTile(i).getPiece();
            if (piece &&
                piece.getString() === predator.getString() &&
                piece.getPosition() !== predator.getPosition()) {
                const moves = piece.getLegalMoves(this.board);
                for (let i = 0, il = moves.length; i < il; i++) {
                    const move = moves[i];
                    if (move.destination === this.move.destination) {
                        identicalMovePieces.push(piece);
                        break;
                    }
                }
            }
        }
        if (identicalMovePieces.length === 1) {
            const boardCode = BoardUtils_1.default.getBoardCode(identicalMovePieces[0].getPosition());
            if (boardCode[0] === this.move.predator[0]) {
                this.fileRankBoardCode = this.move.predator[1];
            }
            else {
                this.fileRankBoardCode = this.move.predator[0];
            }
        }
        else if (identicalMovePieces.length === 2) {
            this.fileRankBoardCode = this.move.predator;
        }
        return this.compile();
    }
    typeCastle() {
        switch (this.move.destination[0]) {
            case "C":
                return "O-O-O";
            case "G":
                return "O-O";
            default:
                throw new _interfaces_1.DetailedError(`Invalid castle destination`, this.move.destination);
        }
    }
    compile() {
        return ((this.predator.toUpperCase() === "P"
            ? this.attacking
                ? this.move.predator[0].toLowerCase()
                : ""
            : this.predator.toUpperCase()) +
            (this.predator.toUpperCase() === "P"
                ? ""
                : this.fileRankBoardCode.toLowerCase()) +
            (this.attacking ? "x" : "") +
            this.destination.toLowerCase() +
            (this.promotes ? `=${this.promotes.toUpperCase()}` : "") +
            (this.checks ? "+" : "") +
            (this.mates ? "#" : ""));
    }
}
exports.default = Notation;
//# sourceMappingURL=notation.js.map