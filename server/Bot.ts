import Board from "./board/Board"
import Move from "./board/Move"
import Team from "./board/Team"

export default class Bot {
	private board: Board
	private team: Team
	private depth: number

	constructor(board: Board, team: Team, depth: number) {
		this.board = board
		this.team = team
		this.depth = depth
	}

	public getBestMove(): Move {
		const allMoves = this.team.getAllSafeMoves(this.board)
		return allMoves[
			this.getBestResult(this.board, this.team, allMoves, this.depth)
		]
	}

	private getBestResult(
		board: Board,
		team: Team,
		moves: Move[],
		depth: number
	): number {
		const scores = []

		for (let i = 0, il = moves.length; i < il; i++) {
			const move = moves[i]
			const result = board.execute(move)
			const enemy = team.getEnemy()
			const allMoves = enemy.getAllSafeMoves(result)

			if (allMoves.length === 0) {
				scores.push(Infinity * this.team.getDirection())
			} else if (depth === 1) {
				scores.push(result.getPoints())
			} else {
				scores.push(
					this.getBestResult(result, enemy, allMoves, depth - 1)
				)
			}
		}

		return depth === this.depth
			? scores.indexOf(team.getBestScore(scores))
			: team.getBestScore(scores)
	}
}
