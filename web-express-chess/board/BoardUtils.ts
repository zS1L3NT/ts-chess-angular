import { DetailedError } from "../_interfaces"
import Bishop from "../pieces/Bishop"
import King from "../pieces/King"
import Knight from "../pieces/Knight"
import Pawn from "../pieces/Pawn"
import Queen from "../pieces/Queen"
import Rook from "../pieces/Rook"
import Team from "./Team"
import Tile from "./Tile"

export default class BoardUtils {
	public static getBoardCode(position: number): string {
		if (!this.isValidPosition(position)) {
			throw new DetailedError(`Position (${position}) is not valid`)
		}
		const letter = [..."ABCDEFGH"][position % 8]
		const number = (8 - ((position / 8) << 0)) << 0
		return letter + number
	}

	public static getPosition(boardCode: string): number {
		if (!this.isValidBoardCode(boardCode)) {
			throw new DetailedError(`Board Code ${boardCode} is not valid`)
		}
		const letter = boardCode[0]
		const number = +boardCode[1]
		return (8 - number) * 8 + [..."ABCDEFGH"].indexOf(letter)
	}

	public static IN_FIRST_COL(position: number): boolean {
		return this.range(0, 56, 8).indexOf(position) >= 0
	}

	public static IN_SECOND_COL(position: number): boolean {
		return this.range(1, 57, 8).indexOf(position) >= 0
	}

	public static IN_SEVENTH_COL(position: number): boolean {
		return this.range(6, 62, 8).indexOf(position) >= 0
	}

	public static IN_EIGHTH_COL(position: number): boolean {
		return this.range(7, 63, 8).indexOf(position) >= 0
	}

	public static IN_SECOND_ROW(position: number): boolean {
		return this.range(8, 15, 1).indexOf(position) >= 0
	}

	public static IN_FOURTH_ROW(position: number): boolean {
		return this.range(24, 31, 1).indexOf(position) >= 0
	}

	public static IN_FIFTH_ROW(position: number): boolean {
		return this.range(32, 39, 1).indexOf(position) >= 0
	}

	public static IN_SEVENTH_ROW(position: number): boolean {
		return this.range(48, 55, 1).indexOf(position) >= 0
	}

	private static range(start: number, stop: number, step: number) {
		return [...Array(Math.floor((stop - start) / step) + 1)].map(
			(_, i) => start + i * step
		)
	}

	public static isValidBoardCode(boardCode: string): boolean {
		return !!boardCode.match(/^[A-H][1-8]$/)
	}

	public static isValidPosition(position: number): boolean {
		return position >= 0 && position < 64
	}

	/**
	 * : Development Methods
	 */

	public static initialBoard(): Tile[] {
		let map: Tile[] = [
			new Tile(0, new Rook(0, new Team("black"), [])),
			new Tile(1, new Knight(1, new Team("black"), [])),
			new Tile(2, new Bishop(2, new Team("black"), [])),
			new Tile(3, new Queen(3, new Team("black"), [])),
			new Tile(4, new King(4, new Team("black"), [])),
			new Tile(5, new Bishop(5, new Team("black"), [])),
			new Tile(6, new Knight(6, new Team("black"), [])),
			new Tile(7, new Rook(7, new Team("black"), []))
		]

		for (let i = 8; i < 16; i++) {
			map.push(new Tile(i, new Pawn(i, new Team("black"), [])))
		}

		for (let i = 16; i < 48; i++) {
			map.push(new Tile(i, null))
		}

		for (let i = 48; i < 56; i++) {
			map.push(new Tile(i, new Pawn(i, new Team("white"), [])))
		}

		map = map.concat([
			new Tile(56, new Rook(56, new Team("white"), [])),
			new Tile(57, new Knight(57, new Team("white"), [])),
			new Tile(58, new Bishop(58, new Team("white"), [])),
			new Tile(59, new Queen(59, new Team("white"), [])),
			new Tile(60, new King(60, new Team("white"), [])),
			new Tile(61, new Bishop(61, new Team("white"), [])),
			new Tile(62, new Knight(62, new Team("white"), [])),
			new Tile(63, new Rook(63, new Team("white"), []))
		])

		return map
	}
}
