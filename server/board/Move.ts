import DetailedError from "../DetailedError"
import Bishop from "../pieces/Bishop"
import Knight from "../pieces/Knight"
import Queen from "../pieces/Queen"
import Rook from "../pieces/Rook"
import Board from "./Board"
import BoardUtils from "./BoardUtils"
import Piece from "./Piece"

/**
 * Move
 * @param type "Shift" | "Attack" | "Castle" | "EnPassant" | "Promote"
 * @param predator string
 * @param destination string
 * @param prey: string
 * @param promote: "Queen" | "Rook" | "Bishop" | "Knight"
 */
export default interface Move {
	type: "Shift" | "Attack" | "Castle" | "EnPassant" | "Promote"
	predator: string
	destination: string
	prey?: string
	promote?: "Queen" | "Rook" | "Bishop" | "Knight"
}

export const ExecuteShift = (move: Move, board: Board) => {
	if (!move.destination)
		throw new DetailedError("No destination", board.printable(), move)

	const predatorPosition = BoardUtils.getPosition(move.predator)
	const destinationPosition = BoardUtils.getPosition(move.destination)
	const predatorTile = board.getTile(predatorPosition)
	const destinationTile = board.getTile(destinationPosition)

	const predator = predatorTile.getPiece()
	if (!predator)
		throw new DetailedError(
			`Tile ${predatorTile.getBoardCode()} has no piece!`,
			board.printable(),
			move
		)

	predatorTile.clearPiece()
	destinationTile.setPiece(predator)
	predator.setPosition(destinationPosition)
}

export const ExecuteAttack = (move: Move, board: Board) => {
	if (!move.prey)
		throw new DetailedError("No prey position", board.printable(), move)

	const predatorPosition = BoardUtils.getPosition(move.predator)
	const preyPosition = BoardUtils.getPosition(move.prey)
	const predatorTile = board.getTile(predatorPosition)
	const preyTile = board.getTile(preyPosition)

	const predator = predatorTile.getPiece()
	if (!predator)
		throw new DetailedError(
			`Tile ${predatorPosition} has no piece!`,
			board.printable(),
			move
		)
	if (preyTile.isEmpty())
		throw new DetailedError(
			`Tile ${preyPosition} has no piece!`,
			board.printable(),
			move
		)

	preyTile.clearPiece()
	predatorTile.clearPiece()
	preyTile.setPiece(predator)
	predator.setPosition(preyPosition)
}

export const ExecuteCastle = (move: Move, board: Board) => {
	const predatorPosition = BoardUtils.getPosition(move.predator)
	const predatorTile = board.getTile(predatorPosition)

	const predator = predatorTile.getPiece()
	if (!predator)
		throw new DetailedError(
			`Tile ${predatorPosition} has no piece!`,
			board.printable(),
			move
		)

	const row = move.predator[1]

	if (move.destination === `C${row}`) {
		const rookTile = board.getTile(BoardUtils.getPosition(`A${row}`))
		const rook = rookTile.getPiece()
		if (!(rook instanceof Rook))
			throw new DetailedError(
				`Piece on ${move.destination} isn't a rook`,
				board.printable(),
				move
			)

		predatorTile.clearPiece()
		rookTile.clearPiece()
		board.getTile(BoardUtils.getPosition(`D${row}`)).setPiece(rook)
		board.getTile(BoardUtils.getPosition(`C${row}`)).setPiece(predator)
		rook.setPosition(BoardUtils.getPosition(`D${row}`))
		predator.setPosition(BoardUtils.getPosition(`C${row}`))
	} else if (move.destination === `G${row}`) {
		const rookTile = board.getTile(BoardUtils.getPosition(`H${row}`))
		const rook = rookTile.getPiece()
		if (!(rook instanceof Rook))
			throw new DetailedError(
				`Piece on ${move.destination} isn't a rook`,
				board.printable(),
				move
			)

		predatorTile.clearPiece()
		rookTile.clearPiece()
		board.getTile(BoardUtils.getPosition(`F${row}`)).setPiece(rook)
		board.getTile(BoardUtils.getPosition(`G${row}`)).setPiece(predator)
		rook.setPosition(BoardUtils.getPosition(`F${row}`))
		predator.setPosition(BoardUtils.getPosition(`G${row}`))
	} else {
		throw new DetailedError(
			`Invalid King destination (${move.destination})`,
			board.printable(),
			move
		)
	}
}

export const ExecuteEnPassant = (move: Move, board: Board) => {
	if (!move.prey)
		throw new DetailedError("No prey position", board.printable(), move)

	const predatorPosition = BoardUtils.getPosition(move.predator)
	const preyPosition = BoardUtils.getPosition(move.prey)
	const destinationPosition = BoardUtils.getPosition(move.destination)
	const predatorTile = board.getTile(predatorPosition)
	const preyTile = board.getTile(preyPosition)
	const destinationTile = board.getTile(destinationPosition)

	const predator = predatorTile.getPiece()
	if (!predator)
		throw new DetailedError(
			`Tile ${predatorPosition} has no piece!`,
			board.printable(),
			move
		)
	if (preyTile.isEmpty())
		throw new DetailedError(
			`Tile ${preyPosition} has no piece!`,
			board.printable(),
			move
		)
	if (destinationTile.isOccupied())
		throw new DetailedError(
			`Destination ${destinationPosition} has a piece!`,
			board.printable(),
			move
		)

	preyTile.clearPiece()
	predatorTile.clearPiece()
	destinationTile.setPiece(predator)
	predator.setPosition(destinationPosition)
}

export const ExecutePromote = (move: Move, board: Board) => {
	if (!move.promote)
		throw new DetailedError(
			"No promoted selection",
			board.printable(),
			move
		)

	const predatorPosition = BoardUtils.getPosition(move.predator)
	const destinationPosition = BoardUtils.getPosition(move.destination)
	const predatorTile = board.getTile(predatorPosition)
	const destinationTile = board.getTile(destinationPosition)

	const predator = predatorTile.getPiece()
	if (!predator)
		throw new DetailedError(
			`Tile ${predatorPosition} has no piece!`,
			board.printable(),
			move
		)

	if (destinationTile.isOccupied()) {
		destinationTile.clearPiece()
	}

	predatorTile.clearPiece()

	let piece: Piece

	switch (move.promote) {
		case "Queen":
			piece = new Queen(destinationPosition, predator.getTeam(), [])
			break
		case "Knight":
			piece = new Knight(destinationPosition, predator.getTeam(), [])
			break
		case "Bishop":
			piece = new Bishop(destinationPosition, predator.getTeam(), [])
			break
		case "Rook":
			piece = new Rook(destinationPosition, predator.getTeam(), [])
			break
		default:
			throw new DetailedError(
				`No piece ${move.promote} to be promoted`,
				board.printable(),
				move
			)
	}

	destinationTile.setPiece(piece)
}
