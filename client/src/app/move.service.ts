import { Injectable } from "@angular/core"
import { APIPiece, Board, APIMove } from "./_interfaces"

@Injectable({
	providedIn: "root"
})
export class MoveService {
	constructor() {}

	public getPiece(state: Board, boardCode: string): APIPiece | null {
		for (let i = 0, il = state.length; i < il; i++) {
			const piece = state[i]
			if (piece && piece.boardCode === boardCode) return piece
		}
		return null
	}

	private updateLocation(
		state: Board,
		boardCode: string,
		newBoardCode: string
	) {
		const piece = this.getPiece(state, boardCode)
		if (!piece) throw new Error(`BoardCode ${boardCode} has no piece`)

		piece.boardCode = newBoardCode
	}

	public clearPiece(state: Board, boardCode: string) {
		for (let i = 0, il = state.length; i < il; i++) {
			const piece = state[i]
			if (piece && piece.boardCode === boardCode) state.splice(i, 1)
		}
	}

	public setPiece(state: Board, boardCode: string, newPiece: APIPiece) {
		for (let i = 0, il = state.length; i < il; i++) {
			const piece = state[i]
			if (piece && piece.boardCode === boardCode) state[i] = newPiece
		}
	}

	public executeShift(
		setEPTS: (epts: string) => void,
		state: Board,
		move: APIMove
	) {
		const predator = this.assertPiece(state, move.predator)
		const destination = this.getPiece(state, move.destination)
		if (destination)
			throw new Error(
				`Destination is occupied by ${JSON.stringify(destination)}`
			)

		if (predator.type === "Pawn") {
			if (move.destination[1] === "5" && move.predator[1] === "7") {
				setEPTS(move.destination[0] + "6")
			} else if (
				move.destination[1] === "4" &&
				move.predator[1] === "2"
			) {
				setEPTS(move.destination[0] + "3")
			} else setEPTS("")
		} else setEPTS("")

		predator.history.push(predator.boardCode)
		this.updateLocation(state, move.predator, move.destination)
		predator.boardCode = move.destination
	}

	public executeAttack(state: Board, move: APIMove) {
		const predator = this.assertPiece(state, move.predator)
		const prey = this.assertPiece(state, move.prey)

		this.clearPiece(state, prey.boardCode)
		predator.history.push(predator.boardCode)
		this.updateLocation(state, move.predator, move.destination)
		predator.boardCode = move.destination
	}

	public executeCastle(state: Board, move: APIMove) {
		const predator = this.assertPiece(state, move.predator)
		const row = move.predator[1]

		if (move.destination === `C${row}`) {
			const rook = this.assertPiece(state, `A${row}`)
			if (rook.type !== "Rook")
				throw new Error(`Piece on ${move.destination} isn't a rook`)

				rook.history.push(rook.boardCode)
			this.updateLocation(state, `A${row}`, `D${row}`)
			rook.boardCode = `D${row}`
			predator.history.push(predator.boardCode)
			this.updateLocation(state, `E${row}`, `C${row}`)
			predator.boardCode = `C${row}`
		} else if (move.destination === `G${row}`) {
			const rook = this.assertPiece(state, `H${row}`)
			if (rook.type !== "Rook")
				throw new Error(`Piece on ${move.destination} isn't a rook`)

				rook.history.push(rook.boardCode)
			this.updateLocation(state, `H${row}`, `F${row}`)
			rook.boardCode = `F${row}`
			predator.history.push(predator.boardCode)
			this.updateLocation(state, `E${row}`, `G${row}`)
			predator.boardCode = `G${row}`
		} else {
			throw new Error(`Invalid King destination (${move.destination})`)
		}
	}

	public executePromote(state: Board, move: APIMove) {
		const predator = this.assertPiece(state, move.predator)
		const promote = move.promote
		if (!promote) throw new Error(`No desired promoted piece`)

		if (this.getPiece(state, move.destination)) {
			this.clearPiece(state, move.destination)
		}

		predator.history.push(predator.boardCode)
		this.updateLocation(state, move.predator, move.destination)
		predator.boardCode = move.destination

		const piece: APIPiece = {
			type: promote,
			boardCode: move.destination,
			team: predator.team,
			history: []
		}
		this.setPiece(state, move.destination, piece)
	}

	private assertPiece(state: Board, boardCode: string | undefined): APIPiece {
		if (!boardCode) throw new Error(`No piece on (${boardCode})`)

		const piece = this.getPiece(state, boardCode)
		if (!piece) throw new Error(`No piece (${boardCode}) on board`)

		return piece
	}
}
