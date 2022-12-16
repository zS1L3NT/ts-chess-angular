import Board from "../board/Board"
import Move from "../board/Move"
import Piece from "../board/Piece"
import Team from "../board/Team"
import Rook from "./Rook"
import BoardUtils from "../board/BoardUtils"

export default class King extends Piece {
	private directions = [-9, -8, -7, -1, 1, 7, 8, 9]

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

		if (this.getHistory().length === 0) {
			const Lrook = board.getTile(this.getPosition() - 4).getPiece()
			const Rrook = board.getTile(this.getPosition() + 3).getPiece()

			const getMove = (destination: number): Move => ({
				type: "Shift",
				predator: this.getBoardCode(),
				destination: BoardUtils.getBoardCode(destination)
			})

			let pieceBetween = false
			if (Lrook instanceof Rook && Lrook.getHistory().length === 0) {
				for (let i = -1; i > -4; i--) {
					if (board.getTile(this.getPosition() + i).isOccupied()) {
						pieceBetween = true
					}
				}

				if (!pieceBetween) {
					const one = getMove(this.getPosition() - 1)
					const two = getMove(this.getPosition() - 2)

					const oneSafe = this.getTeam().isKingSafe(
						board.execute(one)
					)
					const twoSafe = this.getTeam().isKingSafe(
						board.execute(two)
					)

					if (oneSafe && twoSafe) {
						moves.push({
							type: "Castle",
							predator: this.getBoardCode(),
							destination: BoardUtils.getBoardCode(
								this.getPosition() - 2
							)
						})
					}
				}
			}
			pieceBetween = false
			if (Rrook instanceof Rook && Rrook.getHistory().length === 0) {
				for (let i = 1; i < 3; i++) {
					if (board.getTile(this.getPosition() + i).isOccupied()) {
						pieceBetween = true
					}
				}

				if (!pieceBetween) {
					const one = getMove(this.getPosition() + 1)
					const two = getMove(this.getPosition() + 2)

					const oneSafe = this.getTeam().isKingSafe(
						board.execute(one)
					)
					const twoSafe = this.getTeam().isKingSafe(
						board.execute(two)
					)

					if (oneSafe && twoSafe) {
						moves.push({
							type: "Castle",
							predator: this.getBoardCode(),
							destination: BoardUtils.getBoardCode(
								this.getPosition() + 2
							)
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
		const invalidOffsets = [7, -1, -9]
		return (
			BoardUtils.IN_FIRST_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private EighthColException(position: number, offset: number): boolean {
		const invalidOffsets = [-7, 1, 9]
		return (
			BoardUtils.IN_EIGHTH_COL(position) &&
			invalidOffsets.indexOf(offset) >= 0
		)
	}

	private getTeamSpecificPoint(): number {
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
		]
		// prettier-ignore-stop
		return this.getTeam().getString() === "white"
			? points[this.getPosition()]
			: points.reverse()[this.getPosition()]
	}

	public getPoints(): number {
		return (
			(1000 + this.getTeamSpecificPoint()) * this.getTeam().getDirection()
		)
	}

	/**
	 * * COPY
	 */
	public copy(): King {
		return new King(
			this.getPosition(),
			this.getTeam(),
			JSON.parse(JSON.stringify(this.getHistory()))
		)
	}

	public getString(): string {
		return this.getTeam().getString() === "white" ? "K" : "k"
	}
}
