import Board from "../board/Board"
import BoardUtils from "../board/BoardUtils"
import Move from "../board/Move"
import { DetailedError } from "../_interfaces"

export default class Notation {
	private board: Board
	private move: Move

	/*******************************
	 * Determines the initial statement of code.
	 */
	private predator = ""

	/*******************************
	 * Checks if predator code needs to be unique.
	 * For example:
	 * Qd
	 * Q4
	 * Qd4
	 */
	private fileRankBoardCode = ""

	/*******************************
	 * Adds "x" if necessary.
	 */
	private attacking = false

	/*******************************
	 * Writes destination of piece
	 */
	private destination = ""

	/******************************
	 * Promotes
	 */
	private promotes = ""

	/*******************************
	 * See if King is checked
	 */
	private checks = false

	/*******************************
	 * See if King is checkmated
	 */
	private mates = false

	constructor(board: Board, move: Move) {
		this.board = board
		this.move = move
	}

	public getString(): string {
		if (this.move.type === "Castle") return this.typeCastle()
		if (this.move.prey) this.attacking = true
		if (this.move.promote) this.promotes = this.move.promote[0]

		const position = this.move.predator
		const predator = this.board
			.getTile(BoardUtils.getPosition(position))
			.getPiece()
		if (!predator)
			throw new DetailedError(
				`Move has no predator on board`,
				this.board.printable(),
				this.move
			)

		const enemy = predator.getTeam().getEnemy()
		const testBoard = this.board.execute(this.move)
		if (!enemy.isKingSafe(testBoard)) {
			if (enemy.getAllSafeMoves(testBoard).length === 0) {
				this.mates = true
			} else {
				this.checks = true
			}
		}

		const destination = this.move.destination
		this.predator = predator.getString()
		this.destination = destination

		/******************************
		 * Test for identical piece type and move
		 */

		// Identical pieces with the same move
		const identicalMovePieces = []

		for (let i = 0; i < 64; i++) {
			const piece = this.board.getTile(i).getPiece()
			if (
				piece &&
				piece.getString() === predator.getString() &&
				piece.getPosition() !== predator.getPosition()
			) {
				const moves = piece.getLegalMoves(this.board)

				for (let i = 0, il = moves.length; i < il; i++) {
					const move = moves[i]
					if (move.destination === this.move.destination) {
						identicalMovePieces.push(piece)
						break
					}
				}
			}
		}

		if (identicalMovePieces.length === 1) {
			const boardCode = BoardUtils.getBoardCode(
				identicalMovePieces[0].getPosition()
			)

			if (boardCode[0] === this.move.predator[0]) {
				this.fileRankBoardCode = this.move.predator[1]
			} else {
				this.fileRankBoardCode = this.move.predator[0]
			}
		} else if (identicalMovePieces.length === 2) {
			this.fileRankBoardCode = this.move.predator
		}

		return this.compile()
	}

	private typeCastle(): string {
		switch (this.move.destination[0]) {
			case "C":
				return "O-O-O"
			case "G":
				return "O-O"
			default:
				throw new DetailedError(
					`Invalid castle destination`,
					this.move.destination
				)
		}
	}

	private compile(): string {
		return (
			(this.predator.toUpperCase() === "P"
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
			(this.mates ? "#" : "")
		)
	}
}
