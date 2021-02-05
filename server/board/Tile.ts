import Piece from "./Piece"
import BoardUtils from "./BoardUtils"

export default class Tile {
	private position: number
	private piece: Piece | null

	constructor(position: number, piece: Piece | null) {
		this.position = position
		this.piece = piece
	}

	getBoardCode(): string {
		return BoardUtils.getBoardCode(this.position)
	}

	isOccupied(): boolean {
		return this.piece !== null
	}

	isEmpty(): boolean {
		return this.piece === null
	}

	setPiece(piece: Piece) {
		this.piece = piece
	}

	clearPiece() {
		this.piece = null
	}

	getPiece(): Piece | null {
		return this.piece
	}

	/**
	 * * COPY
	 */
	public copy(): Tile {
		return new Tile(this.position, this.piece?.copy() || null)
	}
}
