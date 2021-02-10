"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MinimaxBot {
    constructor(board, team, depth) {
        this.board = board;
        this.team = team;
        this.depth = depth;
    }
    calculate() {
        const allMoves = this.team.getAllSafeMoves(this.board);
        return allMoves[this.getBestResult(this.board, this.team, allMoves, this.depth)];
    }
    getBestResult(board, team, moves, depth) {
        const scores = [];
        for (let i = 0, il = moves.length; i < il; i++) {
            const move = moves[i];
            const result = board.execute(move);
            const enemy = team.getEnemy();
            const allMoves = enemy.getAllSafeMoves(result);
            if (allMoves.length === 0) {
                if (enemy.isKingSafe(result)) {
                    /**
                     * Draw
                     */
                    scores.push(0);
                }
                else {
                    /**
                     * Checkmate
                     */
                    scores.push(Infinity * this.team.getDirection());
                }
            }
            else if (depth === 1) {
                scores.push(result.getPoints());
            }
            else {
                scores.push(this.getBestResult(result, enemy, allMoves, depth - 1));
            }
        }
        return depth === this.depth
            ? scores.indexOf(team.getBestScore(scores))
            : team.getBestScore(scores);
    }
}
exports.default = MinimaxBot;
//# sourceMappingURL=minimaxbot.js.map