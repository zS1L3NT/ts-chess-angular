import Board from "../board/Board"
import BoardUtils from "../board/BoardUtils"
import Move from "../board/Move"
import Piece from "../board/Piece"
import Team from "../board/Team"

export default class Bishop extends Piece {
	private directions = [-9, -7, 7, 9]

	constructor(position: number, team: Team, history: string[]) {
		super(position, team, history)
	}

	public getLegalMoves(board: Board): Move[] {
		const moves: Move[] = []
		for (let i = 0, il = this.directions.length; i < il; i++) {
			const offset = this.directions[i]
			var testPosition = this.getPosition()

			while (BoardUtils.isValidPosition(testPosition)) {
				if (this.ColExceptions(testPosition, offset)) break

				testPosition += offset
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
						break
					} else {
						moves.push({
							type: "Shift",
							predator: this.getBoardCode(),
							destination: tile.getBoardCode()
						})
					}
				}
			}
		}

		return moves
	}

	private ColExceptions(position: number, offset: number): boolean {
		return (
			this.FirstColException(position, offset) ||
			this.EighthColException(position, offset)
		)
	}

	private FirstColException(position: number, offset: number): boolean {
		const invalidOffsets = [-9, 7]
		return (
			BoardUtils.IN_FIRST_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private EighthColException(position: number, offset: number): boolean {
		const invalidOffsets = [9, -7]
		return (
			BoardUtils.IN_EIGHTH_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private getTeamSpecificPoint(): number {
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
	public copy(): Bishop {
		return new Bishop(
			this.getPosition(),
			this.getTeam(),
			JSON.parse(JSON.stringify(this.getHistory()))
		)
	}

	public getString(): string {
		return this.getTeam().getString() === "white" ? "B" : "b"
	}
}
