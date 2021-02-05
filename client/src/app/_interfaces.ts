export interface APIPiece {
	type: "King" | "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn"
	boardCode: string
	team: "white" | "black"
	history: string[]
}

export interface Move {
	type: "Shift" | "Attack" | "Castle" | "EnPassant" | "Promote"
	predator: string
	destination: string
	prey?: string
	promote?: "Queen" | "Rook" | "Bishop" | "Knight"
}

export type Board = APIPiece[]

export type Team = "white" | "black"