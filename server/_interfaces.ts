export interface APIPiece {
	type: "King" | "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn"
	boardCode: string
	team: "white" | "black"
	history: string[]
}