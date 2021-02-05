import { animate, style, transition, trigger } from "@angular/animations"
import { Component, Input, OnDestroy, OnInit } from "@angular/core"
import { BoardService } from "../../board.service"
import { Board, Move, Team } from "../../_interfaces"

@Component({
	selector: "app-board",
	templateUrl: "./board.component.html",
	styleUrls: ["./board.component.scss"],
	animations: [
		trigger("piece", [
			transition(":leave", [
				style({ opacity: "1" }),
				animate("0.3s ease-out", style({ opacity: "0" }))
			])
		])
	]
})
export class BoardComponent implements OnInit, OnDestroy {
	@Input() currentBoardCode = ""
	@Input() team!: Team
	enemy!: Team

	turn: "white" | "black" = "white"
	state: Board = []
	legalMoves: Move[] = []

	constructor(public BoardService: BoardService) {}

	ngOnInit(): void {
		this.enemy = this.team === "white" ? "black" : "white"
		/**
		 * Observes board from BoardService
		 */
		this.BoardService.observer(board => {
			this.state = board
		})

		/**
		 * ? If black
		 *     Get Computer move and then get your legal moves
		 * ? else
		 *     Get your legal moves
		 */
		if (this.team === "black") {
			this.BoardService.getAllLegalMoves().subscribe(moves => {
				this.legalMoves = moves[this.team]
				this.executeComputerMove()
			})
		} else {
			this.getYourLegalMoves()
		}
	}

	ngOnDestroy(): void {
		this.BoardService.resetBoard()
	}

	/**
	 * Queries the server for all our legal moves and states timestamp
	 */
	getYourLegalMoves() {
		const start = new Date().getTime()
		this.BoardService.getAllLegalMoves().subscribe(moves => {
			this.BoardService.pushFENtoHistory([...moves.white, ...moves.black])
			if (moves[this.team].length > 0) {
				this.legalMoves = moves[this.team]
				console.log(
					"Legal Moves: ",
					moves,
					`Response time: ${new Date().getTime() - start}ms`
				)
			} else {
				this.BoardService.getGameStatus().subscribe(({ status }) => {
					this.BoardService.setWinner(status)
				})
			}
		})
	}

	/**
	 * Get's computer move from the server and executes it
	 * Then get's your legal moves
	 */
	executeComputerMove() {
		this.BoardService.getComputerMove(this.enemy, 1).subscribe(D1move => {
			console.log("AI D1 Move: ", D1move)
			this.BoardService.getComputerMove(this.enemy, 2).subscribe(
				D2move => {
					console.log("AI D2 Move: ", D2move)
					if (D2move) {
						this.BoardService.execute(D2move)
						this.turn = this.team
						this.getYourLegalMoves()
					} else {
						this.BoardService.getGameStatus().subscribe(
							({ status }) => {
								this.BoardService.setWinner(status)
							}
						)
					}
				},
				() => {
					if (D1move) {
						this.BoardService.execute(D1move)
						this.turn = this.team
						this.getYourLegalMoves()
					} else {
						this.BoardService.getGameStatus().subscribe(
							({ status }) => {
								this.BoardService.setWinner(status)
							}
						)
					}
				}
			)
		})
	}

	/**
	 * Play against yourself
	 */
	flipTeam(moves: Move[]) {
		const enemy = this.enemy
		this.enemy = this.team
		this.team = enemy
		this.legalMoves = moves
	}

	/**
	 * Finds a move in the list of legal moves where predator and destination
	 */
	findMove(predator: string, destination: string): Move | null {
		for (let i = 0, il = this.legalMoves.length; i < il; i++) {
			const move = this.legalMoves[i]
			if (move.predator === predator && move.destination === destination)
				return move
		}
		return null
	}

	/**
	 * Finds a move in the list of legal moves where predator
	 */
	findMoveDestinationsWherePredator(predator: string): string[] {
		const moves: string[] = []
		for (let i = 0, il = this.legalMoves.length; i < il; i++) {
			const move = this.legalMoves[i]
			if (move.predator === predator) moves.push(move.destination || "")
		}
		return moves
	}

	/**
	 * Click event on board to determine the next output
	 * @param newBoardCode New click event's board code
	 */
	click(newBoardCode: string): void {
		const piece = this.BoardService.getPiece(newBoardCode)

		if (this.currentBoardCode === newBoardCode) {
			// If selected same tile
			this.currentBoardCode = ""
		} else if (!this.currentBoardCode) {
			// If starting to select a tile
			this.currentBoardCode = newBoardCode

			if (piece && piece.team === this.team) {
				// Tile is on your team
				this.currentBoardCode = newBoardCode
			}
		} else {
			// Another tile selected

			if (piece && piece.team === this.team) {
				// Tile is on your team
				this.currentBoardCode = newBoardCode
			} else {
				// Tile isn't an ally
				var newTileMove = this.findMove(
					this.currentBoardCode,
					newBoardCode
				)
				if (newTileMove && this.turn !== this.enemy) {
					/**
					 * If move is a promote move, get the piece to promote to
					 */
					if (newTileMove.type === "Promote") {
						newTileMove.promote = this.getPromote()
					}

					// Current piece is the predator
					this.turn = this.enemy
					this.BoardService.execute(newTileMove)

					this.legalMoves = []
					this.currentBoardCode = ""
					this.BoardService.getAllLegalMoves().subscribe(moves => {
						this.BoardService.pushFENtoHistory([
							...moves.white,
							...moves.black
						])
						this.legalMoves = moves[this.team]
						this.executeComputerMove()
					})
				} else {
					// No move on new tile selected
					this.currentBoardCode = newBoardCode
				}
			}
		}
	}

	/**
	 * Get the type of piece to promote to by the prompt and alert functions
	 */
	getPromote(): "Queen" | "Knight" | "Bishop" | "Rook" {
		while (true) {
			const request = prompt(
				"Promote Pawn to: (Queen/Knight/Rook/Bishop)\nDefaults to a Queen"
			)
			if (!request) return "Queen"
			if (!request.match(/^Queen|Knight|Bishop|Rook$/)) {
				alert("You can only promote to a Queen/Knight/Rook/Bishop")
				continue
			}

			return request as "Queen" | "Knight" | "Bishop" | "Rook"
		}
	}

	/**
	 * Gets the file name of a piece from the chess.com server
	 * @param boardCode Board code to convert
	 */
	formFileName(boardCode: string): string {
		const piece = this.BoardService.getPiece(boardCode)
		if (piece) {
			return (
				piece.team[0] +
				(piece.type === "Knight" ? "n" : piece.type[0].toLowerCase())
			)
		}
		return ""
	}

	/**
	 * Check if a piece has any possible moves to be executed
	 * @param boardCode Board code of the piece
	 */
	hasAMove(boardCode: string): boolean {
		for (let i = 0, il = this.legalMoves.length; i < il; i++) {
			const move = this.legalMoves[i]
			if (move.predator === boardCode) return true
		}
		return false
	}
}
