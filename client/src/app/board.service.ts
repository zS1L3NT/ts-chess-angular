import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { MoveService } from "./move.service"
import { APIPiece, Board, Move, Team } from "./_interfaces"

@Injectable({
	providedIn: "root"
})
export class BoardService {
	private state: Board
	private epts: string = ""
	private winner: "white" | "black" | "draw" | "" = ""
	private onchange: ((board: Board) => void) | undefined
	private history: string[] = []
	private host

	constructor(private http: HttpClient, private MoveService: MoveService) {
		this.state = this.initialise()
		this.host =
			window.location.hostname === "localhost"
				? "http://localhost:5000"
				: ""
	}

	public observer(onchange: (board: Board) => void) {
		this.onchange = onchange
		onchange(this.state)
	}

	/**
	 * Get all legal moves for a team from the server
	 */
	public getAllLegalMoves() {
		return this.http.post<{ white: Move[]; black: Move[] }>(
			`${this.host}/api/getAllSafeMoves`,
			this.httpBody()
		)
	}

	/**
	 * Get the move by the AI from the server
	 */
	public getComputerMove(team: Team, depth: number) {
		return this.http.post<Move>(
			`${this.host}/api/getComputerMove/${team}`,
			{ ...this.httpBody(), depth }
		)
	}

	/**
	 * Determine the state of the game from the server
	 */
	public getGameStatus() {
		return this.http.post<{ status: "white" | "black" | "draw" }>(
			`${this.host}/api/getGameStatus`,
			this.httpBody()
		)
	}

	/**
	 * Generates an object to put in the body of all the HTTP requests
	 *
	 * @argument board
	 * @argument epts
	 */
	private httpBody() {
		const board: APIPiece[] = []
		const keys = this.getAllBoardCodes()
		for (let i = 0, il = keys.length; i < il; i++) {
			const piece = this.getPiece(keys[i])
			if (piece) board.push(piece)
		}
		return { board, epts: this.epts }
	}

	/**
	 * Generate a list of all the possible board codes
	 */
	public getAllBoardCodes(): string[] {
		const codes: string[] = []
		"87654321".split("").forEach(n =>
			"ABCDEFGH".split("").forEach(l => {
				codes.push(l + n)
			})
		)

		return codes
	}

	public getWinner(): "white" | "black" | "draw" | "" {
		return this.winner
	}

	public setWinner(winner: "white" | "black" | "draw") {
		this.winner = winner
	}

	public getPiece(boardCode: string): APIPiece | null {
		for (let i = 0, il = this.state.length; i < il; i++) {
			const piece = this.state[i]
			if (piece && piece.boardCode === boardCode) return piece
		}
		return null
	}

	public resetBoard() {
		this.state = this.initialise()
		this.history = []
		this.winner = ""
		this.epts = ""
	}

	public execute(move: Move) {
		if (!move.destination)
			throw new Error(`No destination in (${JSON.stringify(move)})`)

		switch (move.type) {
			case "Shift":
				this.MoveService.executeShift(
					(epts: string) => {
						this.epts = epts
					},
					this.state,
					move
				)
				return
			case "Attack":
			case "EnPassant":
				this.MoveService.executeAttack(this.state, move)
				return
			case "Castle":
				this.MoveService.executeCastle(this.state, move)
				return
			case "Promote":
				this.MoveService.executePromote(this.state, move)
				return
			default:
		}

		this.onchange ? this.onchange(this.state) : null
	}

	public pushFENtoHistory(moves: Move[]) {
		let fen: string[] = ["", ""]
		let number = "8"
		let count = 0

		for (let i = 0, il = this.getAllBoardCodes().length; i < il; i++) {
			const boardCode = this.getAllBoardCodes()[i]

			if (boardCode[1] !== number) {
				fen[0] += (count || "") + "/"
				count = 0
				number = boardCode[1]
			}
			const piece = this.getPiece(boardCode)
			if (piece) {
				if (count !== 0) {
					fen[0] += count
					count = 0
				}
				let rep = piece.type === "Knight" ? "N" : piece.type[0]
				rep =
					piece.team === "black"
						? rep.toLowerCase()
						: rep.toUpperCase()
				fen[0] += rep
			} else {
				count++
			}
		}

		for (let i = 0, il = moves.length; i < il; i++) {
			const move = moves[i]
			if (move.type === "Castle") {
				if (move.destination === "G1") fen[1] += "K"
				if (move.destination === "C1") fen[1] += "Q"
				if (move.destination === "G8") fen[1] += "k"
				if (move.destination === "C8") fen[1] += "q"
			}
		}

		if (this.epts) fen[2] = this.epts

		const FEN = fen.join(" ")
		this.history.push(FEN)

		const appearances = this.history.reduce(
			(a, v) => (v === FEN ? a + 1 : a),
			0
		)
		if (appearances === 3) this.setWinner("draw")
	}

	public initialise(): Board {
		const board: Board = []
		const letters = [..."ABCDEFGH"]

		board.push({
			type: "Rook",
			boardCode: "A8",
			team: "black",
			history: []
		})
		board.push({
			type: "Knight",
			boardCode: "B8",
			team: "black",
			history: []
		})
		board.push({
			type: "Bishop",
			boardCode: "C8",
			team: "black",
			history: []
		})
		board.push({
			type: "Queen",
			boardCode: "D8",
			team: "black",
			history: []
		})
		board.push({
			type: "King",
			boardCode: "E8",
			team: "black",
			history: []
		})
		board.push({
			type: "Bishop",
			boardCode: "F8",
			team: "black",
			history: []
		})
		board.push({
			type: "Knight",
			boardCode: "G8",
			team: "black",
			history: []
		})
		board.push({
			type: "Rook",
			boardCode: "H8",
			team: "black",
			history: []
		})

		for (let i = 0, il = letters.length; i < il; i++) {
			const letter = letters[i]
			board.push({
				type: "Pawn",
				boardCode: `${letter}7`,
				team: "black",
				history: []
			})
		}

		for (let i = 0, il = letters.length; i < il; i++) {
			const letter = letters[i]
			board.push({
				type: "Pawn",
				boardCode: `${letter}2`,
				team: "white",
				history: []
			})
		}

		board.push({
			type: "Rook",
			boardCode: "A1",
			team: "white",
			history: []
		})
		board.push({
			type: "Knight",
			boardCode: "B1",
			team: "white",
			history: []
		})
		board.push({
			type: "Bishop",
			boardCode: "C1",
			team: "white",
			history: []
		})
		board.push({
			type: "Queen",
			boardCode: "D1",
			team: "white",
			history: []
		})
		board.push({
			type: "King",
			boardCode: "E1",
			team: "white",
			history: []
		})
		board.push({
			type: "Bishop",
			boardCode: "F1",
			team: "white",
			history: []
		})
		board.push({
			type: "Knight",
			boardCode: "G1",
			team: "white",
			history: []
		})
		board.push({
			type: "Rook",
			boardCode: "H1",
			team: "white",
			history: []
		})

		this.onchange ? this.onchange(board) : null
		return board
	}
}
