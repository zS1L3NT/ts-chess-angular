import { Response } from "express"
import BoardUtils from "./board/BoardUtils"
import Team from "./board/Team"
import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Pawn from "./pieces/Pawn"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import { APIPiece } from "./_interfaces"

export const ConvertPiece = (piece: APIPiece) => {
	const position = BoardUtils.getPosition(piece.boardCode)
	const team = new Team(piece.team)

	switch (piece.type) {
		case "King":
			return new King(position, team, piece.history)
		case "Queen":
			return new Queen(position, team, piece.history)
		case "Rook":
			return new Rook(position, team, piece.history)
		case "Bishop":
			return new Bishop(position, team, piece.history)
		case "Knight":
			return new Knight(position, team, piece.history)
		case "Pawn":
			return new Pawn(position, team, piece.history)
	}
}

export const ValidateTeamParam = (
	res: Response,
	team: any
): "white" | "black" | undefined => {
	if (!team) {
		res.status(400).send(`Must provide 'team' parameter`)
		return
	}
	if (typeof team !== "string" || !team.match(/^white|black$/)) {
		res.status(400).send(
			`Team must be a string of 'white' or 'black' but got ${team}`
		)
		return
	}

	return team as "white" | "black"
}

export const ValidateBoardBody = (
	res: Response,
	board: any
): APIPiece[] | undefined => {
	if (!board) {
		res.status(400).send(`Must provide 'board' body`)
		return
	}
	for (let i = 0, il = board.length; i < il; i++) {
		const piece = board[i]

		if (!piece) {
			res.status(400).send(`Must provide 'piece' in 'board' body`)
			return
		}
		if (
			typeof piece.type !== "string" ||
			!piece.type.match(/^King|Queen|Rook|Bishop|Knight|Pawn/)
		) {
			res.status(400).send(
				`Piece at index (${i}) must have a proprerty 'type' of type "King" | "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn"`
			)
			return
		}
		if (typeof piece.boardCode !== "string") {
			res.status(400).send(
				`Piece at index (${i}) must have a property 'boardCode' of type string`
			)
			return
		}
		if (typeof piece.team !== "string") {
			res.status(400).send(
				`Piece at index (${i}) must have a property 'team' of type string`
			)
			return
		}
		if (
			typeof piece.history !== "object" ||
			(JSON.stringify(piece.history) !== "[]" &&
				typeof piece.history[0] !== "string")
		) {
			res.status(400).send(
				`Piece at index (${i}) must have a property 'history' of type string[]`
			)
			return
		}
	}

	return board as APIPiece[]
}

export const ValidateEPTS = (res: Response, epts: any): string | undefined => {
	if (typeof epts !== "string") {
		res.status(400).send(
			`epts must be a string or empty but got (${epts})`
		)
		return
	}
	if (!epts) return epts as string
	if (!epts.match(/^[A-H][1-8]$/)) {
		res.status(400).send(
			`epts must be a string of a board codebut got (${epts})`
		)
		return
	}
	return epts as string
}
