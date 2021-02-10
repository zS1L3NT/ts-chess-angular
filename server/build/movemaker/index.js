"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Team_1 = __importDefault(require("../board/Team"));
const conversions_1 = require("../conversions");
const minimaxbot_1 = __importDefault(require("./minimaxbot"));
exports.default = (database, board, depth, history, team) => {
    let move;
    let ref = database;
    for (let i = 0, il = history.length; i < il; i++) {
        const notation = history[i];
        ref = ref ? ref[notation] : undefined;
    }
    if (ref && ref.wins.total > 0) {
        /**
         * In the start of the game, compare the games to a database
         */
        const notations = Object.keys(ref).filter(n => n !== "wins");
        let bestPercent = 0;
        let bestTotalGames = 0;
        let bestMove = "";
        for (let i = 0, il = notations.length; i < il; i++) {
            const notation = notations[i];
            const result = ref[notation].wins;
            const percent = result[team] / result.total;
            if (percent > bestPercent ||
                (percent === bestPercent && result.total > bestTotalGames)) {
                bestPercent = percent;
                bestTotalGames = result.total;
                bestMove = notation;
            }
            const safeMoves = new Team_1.default(team).getAllSafeMoves(board);
            for (let i = 0, il = safeMoves.length; i < il; i++) {
                const safeMove = conversions_1.addNotation(board, safeMoves[i]);
                if (safeMove.notation === bestMove) {
                    move = safeMove;
                    break;
                }
            }
        }
    }
    else {
        move = new minimaxbot_1.default(board, new Team_1.default(team), depth).calculate();
    }
    return move;
};
//# sourceMappingURL=index.js.map