export interface APIPiece {
	type: "King" | "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn"
	boardCode: string
	team: "white" | "black"
	history: string[]
}

export interface APIBody {
	board: APIPiece[]
	epts: string
}

export interface APIParams {
	team: "white" | "black"
}
