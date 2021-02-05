import DetailedError from "../DetailedError"
import King from "../pieces/King"
import Board from "./Board"
import BoardUtils from "./BoardUtils"
import Move from "./Move"

export default class Team {
	private team: "white" | "black"

	constructor(team: "white" | "black") {
		this.team = team
	}

	public getString(): "white" | "black" {
		return this.team
	}

	public getBestScore(scores: number[]): number {
		return this.team === "white" ? Math.min(...scores) : Math.max(...scores)
	}

	public isWhite(): boolean {
		return this.team === "white"
	}

	public isBlack(): boolean {
		return this.team === "black"
	}

	public getDirection(): number {
		return this.team === "white" ? -1 : 1
	}

	public getEnemy(): Team {
		return this.getString() === "white"
			? new Team("black")
			: new Team("white")
	}

	/**
	 * @time 20mcs ~ 400mcs
	 * @param board Board
	 */
	public getKingPosition(board: Board): number {
		// const t = new Timer("getKingPosition")

		for (let i = 0; i < 64; i++) {
			const tile = board.getTile(i)
			if (tile.isEmpty()) continue

			const piece = tile.getPiece()!
			if (piece.getTeam().getString() !== this.getString()) continue

			if (piece instanceof King) {
				// t.stop()
				return piece.getPosition()
			}
		}

		throw new DetailedError("King not found???", board.printable())
	}

	/**
	 * @time 1ms ~ 5ms
	 * @param board Board
	 */
	public getAllLegalMoves(board: Board): Move[] {
		// const t = new Timer("getAllLegalMoves")
		const moves: Move[] = []

		for (let i = 0; i < 64; i++) {
			const tile = board.getTile(i)

			if (tile.isEmpty()) continue
			if (tile.getPiece()!.getTeam().getString() !== this.getString())
				continue

			const legalMoves = tile.getPiece()!.getLegalMoves(board)
			if (legalMoves.length === 0) continue
			for (let j = 0; j < legalMoves.length; j++) {
				moves.push(legalMoves[j])
			}
		}

		// t.stop()
		return moves
	}

	/**
	 * @time 1ms ~ 40ms
	 * @param board BoardUtils
	 */
	public isKingSafe(board: Board): boolean {
		// const t = new Timer("isKingSafe")
		const enemy =
			this.getString() === "white" ? new Team("black") : new Team("white")
		const allLegalMoves = enemy.getAllLegalMoves(board)
		const kingBoardCode = BoardUtils.getBoardCode(
			this.getKingPosition(board)
		)

		for (let i = 0, il = allLegalMoves.length; i < il; i++) {
			const move = allLegalMoves[i]
			if (move.destination === kingBoardCode) {
				return false
			}
		}

		// t.stop()
		return true
	}

	/**
	 * @time 500mcs ~ 30ms
	 * @param board Board
	 */
	public getAllSafeMoves(board: Board): Move[] {
		// const t = new Timer("getAllSafeMoves")
		const moves: Move[] = []
		for (let i = 0; i < 64; i++) {
			const tile = board.getTile(i)

			if (tile.isEmpty()) continue
			if (tile.getPiece()!.getTeam().getString() !== this.getString())
				continue

			const safeMoves = tile.getPiece()!.getSafeMoves(board)

			for (let j = 0; j < safeMoves.length; j++) {
				moves.push(safeMoves[j])
			}
		}

		// t.stop()
		return moves
	}
}