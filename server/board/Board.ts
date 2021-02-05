import Move, {
	ExecuteAttack,
	ExecuteCastle,
	ExecuteEnPassant,
	ExecuteShift,
	ExecutePromote
} from "./Move"
import Tile from "./Tile"
import Team from "./Team"
import DetailedError from "../DetailedError"
export default class Board {
	private board: Tile[] = []
	public epts: string

	constructor(epts: string, tiles: Tile[]) {
		this.epts = epts

		for (let i = 0; i < 64; i++) {
			this.board[i] = tiles[i]
		}
	}

	public execute(move: Move): Board {
		const tilesCopy = []
		for (let i = 0, il = this.board.length; i < il; i++) {
			const tile = this.board[i]
			tilesCopy.push(tile.copy())
		}
		const boardCopy = new Board(this.epts, tilesCopy)

		switch (move.type) {
			case "Shift":
				ExecuteShift(move, boardCopy)
				break
			case "Attack":
				ExecuteAttack(move, boardCopy)
				break
			case "Castle":
				ExecuteCastle(move, boardCopy)
				break
			case "EnPassant":
				ExecuteEnPassant(move, boardCopy)
				break
			case "Promote":
				ExecutePromote(move, boardCopy)
				break
			default:
				throw new DetailedError(
					`Invalid move type (${move.type})`,
					move
				)
		}

		boardCopy.epts = ""
		return boardCopy
	}

	public getTile(position: number): Tile {
		return this.board[position]
	}

	public getPoints(): number {
		let count = 0

		const white = new Team("white")
		const black = new Team("black")

		if (
			white.getAllSafeMoves(this).length === 0 &&
			!white.isKingSafe(this)
		) {
			return Infinity
		} else if (
			black.getAllSafeMoves(this).length === 0 &&
			!black.isKingSafe(this)
		) {
			return -Infinity
		}

		for (let i = 0, il = this.board.length; i < il; i++) {
			const tile = this.board[i]
			const piece = tile.getPiece()

			if (piece) count += piece.getPoints()
		}

		return count
	}

	/**
	 * : Development methods
	 */

	public printable(): string {
		const numbers = [...'87654321']
		let string = `\n     A   B   C   D   E   F   G   H\n`
		string += `   ${"+---".repeat(8)}+\n`

		for (let i = 0; i < 8; i++) {
			string += ` ${numbers[i]} `

			for (let j = 0; j < 8; j++) {
				const position = i * 8 + j
				const piece = this.board[position].getPiece()
				string += "| " + (piece ? piece.getString() : " ") + " "
			}

			string += `|\n   ${"+---".repeat(8)}+\n`
		}

		return string
	}

	public print() {
		console.log(this.printable())
	}
}
