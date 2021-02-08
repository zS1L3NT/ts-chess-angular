import Board from "../board/Board"
import BoardUtils from "../board/BoardUtils"
import Move from "../board/Move"
import Piece from "../board/Piece"
import Team from "../board/Team"

export default class Pawn extends Piece {
	private directions = [7, 8, 9, 16]
	private promotes: ("Queen" | "Rook" | "Bishop" | "Knight")[] = [
		"Queen",
		"Rook",
		"Bishop",
		"Knight"
	]

	constructor(position: number, team: Team, history: string[]) {
		super(position, team, history)
	}

	public getLegalMoves(board: Board): Move[] {
		const moves: Move[] = []

		for (let i = 0, il = this.directions.length; i < il; i++) {
			const offset = this.directions[i]
			const testPosition =
				this.getPosition() + offset * this.getTeam().getDirection()

			if (!BoardUtils.isValidPosition(testPosition)) continue

			const tile = board.getTile(testPosition)

			if (offset === 8 && tile.isEmpty()) {
				/**
				 * * Single forward
				 * * Promotable
				 */
				if (this.PromotionException()) {
					for (let i = 0, il = 4; i < il; i++) {
						const promote = this.promotes[i]
						moves.push({
							type: "Promote",
							predator: this.getBoardCode(),
							destination: tile.getBoardCode(),
							promote
						})
					}
				} else {
					moves.push({
						type: "Shift",
						predator: this.getBoardCode(),
						destination: tile.getBoardCode()
					})
				}
			} else if (offset === 16 && this.getHistory().length === 0) {
				/**
				 * * Double forward
				 */
				const tileBetween = board.getTile(
					this.getPosition() + 8 * this.getTeam().getDirection()
				)
				if (tileBetween.isEmpty() && tile.isEmpty()) {
					moves.push({
						type: "Shift",
						predator: this.getBoardCode(),
						destination: tile.getBoardCode()
					})
				}
			} else if (
				(offset === 7 && !this.SevenException()) ||
				(offset === 9 && !this.NineException())
			) {
				/**
				 * * Sideways attacks
				 * * Promotable
				 */
				if (
					tile.isOccupied() &&
					tile.getPiece()!.getTeam().getString() !==
						this.getTeam().getString()
				) {
					if (this.PromotionException()) {
						for (let i = 0, il = 4; i < il; i++) {
							const promote = this.promotes[i]
							moves.push({
								type: "Promote",
								predator: this.getBoardCode(),
								destination: tile.getBoardCode(),
								prey: tile.getBoardCode(),
								promote
							})
						}
					} else {
						moves.push({
							type: "Attack",
							predator: this.getBoardCode(),
							destination: tile.getBoardCode(),
							prey: tile.getBoardCode()
						})
					}
				}
			}
			if (this.PredatorEnPassantException()) {
				// In row ready for en passant
				const Lpawn = board
					.getTile(this.getPosition() + this.getTeam().getDirection())
					.getPiece()
				const Rpawn = board
					.getTile(this.getPosition() - this.getTeam().getDirection())
					.getPiece()

				if (
					!this.NineException() &&
					offset === 7 &&
					Lpawn instanceof Pawn
				) {
					const destination = BoardUtils.getBoardCode(
						this.getPosition() + 9 * this.getTeam().getDirection()
					)

					if (board.epts === destination) {
						moves.push({
							type: "EnPassant",
							predator: this.getBoardCode(),
							destination,
							prey: Lpawn.getBoardCode()
						})
					}
				}

				if (
					!this.SevenException() &&
					offset === 9 &&
					Rpawn instanceof Pawn
				) {
					const destination = BoardUtils.getBoardCode(
						this.getPosition() + 7 * this.getTeam().getDirection()
					)

					if (board.epts === destination) {
						moves.push({
							type: "EnPassant",
							predator: this.getBoardCode(),
							destination,
							prey: Rpawn.getBoardCode()
						})
					}
				}
			}
		}

		return moves
	}

	private SevenException(): boolean {
		return (
			(BoardUtils.IN_EIGHTH_COL(this.getPosition()) &&
				this.getTeam().isWhite()) ||
			(BoardUtils.IN_FIRST_COL(this.getPosition()) &&
				this.getTeam().isBlack())
		)
	}

	private NineException(): boolean {
		return (
			(BoardUtils.IN_FIRST_COL(this.getPosition()) &&
				this.getTeam().isWhite()) ||
			(BoardUtils.IN_EIGHTH_COL(this.getPosition()) &&
				this.getTeam().isBlack())
		)
	}

	private PromotionException(): boolean {
		return (
			(this.getTeam().isBlack() &&
				BoardUtils.IN_SEVENTH_ROW(this.getPosition())) ||
			(this.getTeam().isWhite() &&
				BoardUtils.IN_SECOND_ROW(this.getPosition()))
		)
	}

	private PredatorEnPassantException(): boolean {
		return (
			(this.getTeam().isWhite() &&
				BoardUtils.IN_FOURTH_ROW(this.getPosition())) ||
			(this.getTeam().isBlack() &&
				BoardUtils.IN_FIFTH_ROW(this.getPosition()))
		)
	}

	private getTeamSpecificPoint(): number {
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
		]
		// prettier-ignore-stop

		return this.getTeam().getString() === "white"
			? points[this.getPosition()]
			: points.reverse()[this.getPosition()]
	}

	public getPoints(): number {
		return (
			(10 + this.getTeamSpecificPoint()) * this.getTeam().getDirection()
		)
	}

	/**
	 * * COPY
	 */
	public copy(): Pawn {
		return new Pawn(
			this.getPosition(),
			this.getTeam(),
			JSON.parse(JSON.stringify(this.getHistory()))
		)
	}

	public getString(): string {
		return this.getTeam().getString() === "white" ? "P" : "p"
	}
}
