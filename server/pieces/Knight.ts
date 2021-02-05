import Board from "../board/Board"
import Move from "../board/Move"
import Piece from "../board/Piece"
import Team from "../board/Team"
import BoardUtils from "../board/BoardUtils"

export default class Knight extends Piece {
	private directions = [-10, -17, -15, -6, 10, 17, 15, 6]

	constructor(position: number, team: Team, history: string[]) {
		super(position, team, history)
	}

	public getLegalMoves(board: Board): Move[] {
		const moves: Move[] = []
		for (let i = 0, il = this.directions.length; i < il; i++) {
			const offset = this.directions[i]
			const testPosition = this.getPosition() + offset

			if (this.ColExceptions(this.getPosition(), offset)) continue

			if (BoardUtils.isValidPosition(testPosition)) {
				const tile = board.getTile(testPosition)

				if (tile.isOccupied()) {
					const piece = tile.getPiece()!
					if (
						piece.getTeam().getString() !==
						this.getTeam().getString()
					) {
						moves.push({
							type: "Attack",
							predator: this.getBoardCode(),
							destination: piece.getBoardCode(),
							prey: piece.getBoardCode()
						})
					}
				} else {
					moves.push({
						type: "Shift",
						predator: this.getBoardCode(),
						destination: tile.getBoardCode()
					})
				}
			}
		}

		return moves
	}

	private ColExceptions(position: number, offset: number): boolean {
		return (
			this.FirstColException(position, offset) ||
			this.SecondColException(position, offset) ||
			this.SeventhColException(position, offset) ||
			this.EighthColException(position, offset)
		)
	}

	private FirstColException(position: number, offset: number): boolean {
		const invalidOffsets = [-10, -17, 15, 6]
		return (
			BoardUtils.IN_FIRST_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private SecondColException(position: number, offset: number): boolean {
		const invalidOffsets = [-10, 6]
		return (
			BoardUtils.IN_SECOND_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private SeventhColException(position: number, offset: number): boolean {
		const invalidOffsets = [10, -6]
		return (
			BoardUtils.IN_SEVENTH_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private EighthColException(position: number, offset: number): boolean {
		const invalidOffsets = [10, 17, -15, -6]
		return (
			BoardUtils.IN_EIGHTH_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private getTeamSpecificPoint(): number {
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
		]
		// prettier-ignore-stop

		return this.getTeam().getString() === "white"
			? points[this.getPosition()]
			: points.reverse()[this.getPosition()]
	}

	public getPoints(): number {
		return (
			(30 + this.getTeamSpecificPoint()) * this.getTeam().getDirection()
		)
	}

	/**
	 * * COPY
	 */
	public copy(): Knight {
		return new Knight(
			this.getPosition(),
			this.getTeam(),
			JSON.parse(JSON.stringify(this.getHistory()))
		)
	}

	/**
	 * : Development methods
	 */

	public getString(): string {
		return this.getTeam().getString() === "white" ? "N" : "n"
	}
}
