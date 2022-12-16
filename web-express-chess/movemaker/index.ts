import Board from "../board/Board"
import Move from "../board/Move"
import Team from "../board/Team"
import { addNotation } from "../conversions"
import MinimaxBot from "./minimaxbot"

export default (
	database: any,
	board: Board,
	depth: number,
	history: string[],
	team: "white" | "black"
): Move => {
	let move!: Move

	let ref = database
	for (let i = 0, il = history.length; i < il; i++) {
		const notation = history[i]
		ref = ref ? ref[notation] : undefined
	}

	if (ref && ref.wins.total > 0) {
		/**
		 * In the start of the game, compare the games to a database
		 */
		const notations = Object.keys(ref).filter(n => n !== "wins")
		let bestPercent = 0
		let bestTotalGames = 0
		let bestMove = ""

		for (let i = 0, il = notations.length; i < il; i++) {
			const notation = notations[i]

			const result = ref[notation].wins
			const percent = result[team] / result.total

			if (
				percent > bestPercent ||
				(percent === bestPercent && result.total > bestTotalGames)
			) {
				bestPercent = percent
				bestTotalGames = result.total
				bestMove = notation
			}

			const safeMoves = new Team(team).getAllSafeMoves(board)
			for (let i = 0, il = safeMoves.length; i < il; i++) {
				const safeMove = addNotation(board, safeMoves[i])
				if (safeMove.notation === bestMove) {
					move = safeMove
					break
				}
			}
		}
	} else {
		move = new MinimaxBot(board, new Team(team), depth).calculate()
	}

	return move
}
