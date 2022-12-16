import Board from "./Board"
import BoardUtils from "./BoardUtils"
import Move from "./Move"
import Team from "./Team"

export default abstract class Piece {
	private position: number
	private team: Team
	private history: string[]

	constructor(position: number, team: Team, history: string[]) {
		this.position = position
		this.team = team
		this.history = history
	}

	public abstract getLegalMoves(board: Board): Move[]

	public getBoardCode(): string {
		return BoardUtils.getBoardCode(this.position)
	}

	/**
	 * 
	 * @time 0.1ms ~ 7ms
	 * @param board Board
	 */
	public getSafeMoves(board: Board): Move[] {
		// const t = new Timer("getSafeMoves")
		const legalMoves = this.getLegalMoves(board)
		const moves: Move[] = []

		for (let i = 0, il = legalMoves.length; i < il; i++) {
			const move = legalMoves[i]

			if (this.getTeam().isKingSafe(board.execute(move))) {
				moves.push(move)
			}
		}
		// t.stop()

		return moves
	}

	public setPosition(position: number): void {
		this.history.push(BoardUtils.getBoardCode(this.position))
		this.position = position
	}

	public getHistory(): string[] {
		return this.history
	}

	public getPosition(): number {
		return this.position
	}

	public getTeam(): Team {
		return this.team
	}

	public abstract getPoints(): number

	/**
	 * * COPY
	 */
	public abstract copy(): Piece

	/**
	 * : Development methods
	 */

	public abstract getString(): string
}
