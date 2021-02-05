"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutePromote = exports.ExecuteEnPassant = exports.ExecuteCastle = exports.ExecuteAttack = exports.ExecuteShift = void 0;
const _interfaces_1 = require("../_interfaces");
const Bishop_1 = __importDefault(require("../pieces/Bishop"));
const Knight_1 = __importDefault(require("../pieces/Knight"));
const Queen_1 = __importDefault(require("../pieces/Queen"));
const Rook_1 = __importDefault(require("../pieces/Rook"));
const BoardUtils_1 = __importDefault(require("./BoardUtils"));
const ExecuteShift = (move, board) => {
    if (!move.destination)
        throw new _interfaces_1.DetailedError("No destination", board.printable(), move);
    const predatorPosition = BoardUtils_1.default.getPosition(move.predator);
    const destinationPosition = BoardUtils_1.default.getPosition(move.destination);
    const predatorTile = board.getTile(predatorPosition);
    const destinationTile = board.getTile(destinationPosition);
    const predator = predatorTile.getPiece();
    if (!predator)
        throw new _interfaces_1.DetailedError(`Tile ${predatorTile.getBoardCode()} has no piece!`, board.printable(), move);
    predatorTile.clearPiece();
    destinationTile.setPiece(predator);
    predator.setPosition(destinationPosition);
};
exports.ExecuteShift = ExecuteShift;
const ExecuteAttack = (move, board) => {
    if (!move.prey)
        throw new _interfaces_1.DetailedError("No prey position", board.printable(), move);
    const predatorPosition = BoardUtils_1.default.getPosition(move.predator);
    const preyPosition = BoardUtils_1.default.getPosition(move.prey);
    const predatorTile = board.getTile(predatorPosition);
    const preyTile = board.getTile(preyPosition);
    const predator = predatorTile.getPiece();
    if (!predator)
        throw new _interfaces_1.DetailedError(`Tile ${predatorPosition} has no piece!`, board.printable(), move);
    if (preyTile.isEmpty())
        throw new _interfaces_1.DetailedError(`Tile ${preyPosition} has no piece!`, board.printable(), move);
    preyTile.clearPiece();
    predatorTile.clearPiece();
    preyTile.setPiece(predator);
    predator.setPosition(preyPosition);
};
exports.ExecuteAttack = ExecuteAttack;
const ExecuteCastle = (move, board) => {
    const predatorPosition = BoardUtils_1.default.getPosition(move.predator);
    const predatorTile = board.getTile(predatorPosition);
    const predator = predatorTile.getPiece();
    if (!predator)
        throw new _interfaces_1.DetailedError(`Tile ${predatorPosition} has no piece!`, board.printable(), move);
    const row = move.predator[1];
    if (move.destination === `C${row}`) {
        const rookTile = board.getTile(BoardUtils_1.default.getPosition(`A${row}`));
        const rook = rookTile.getPiece();
        if (!(rook instanceof Rook_1.default))
            throw new _interfaces_1.DetailedError(`Piece on ${move.destination} isn't a rook`, board.printable(), move);
        predatorTile.clearPiece();
        rookTile.clearPiece();
        board.getTile(BoardUtils_1.default.getPosition(`D${row}`)).setPiece(rook);
        board.getTile(BoardUtils_1.default.getPosition(`C${row}`)).setPiece(predator);
        rook.setPosition(BoardUtils_1.default.getPosition(`D${row}`));
        predator.setPosition(BoardUtils_1.default.getPosition(`C${row}`));
    }
    else if (move.destination === `G${row}`) {
        const rookTile = board.getTile(BoardUtils_1.default.getPosition(`H${row}`));
        const rook = rookTile.getPiece();
        if (!(rook instanceof Rook_1.default))
            throw new _interfaces_1.DetailedError(`Piece on ${move.destination} isn't a rook`, board.printable(), move);
        predatorTile.clearPiece();
        rookTile.clearPiece();
        board.getTile(BoardUtils_1.default.getPosition(`F${row}`)).setPiece(rook);
        board.getTile(BoardUtils_1.default.getPosition(`G${row}`)).setPiece(predator);
        rook.setPosition(BoardUtils_1.default.getPosition(`F${row}`));
        predator.setPosition(BoardUtils_1.default.getPosition(`G${row}`));
    }
    else {
        throw new _interfaces_1.DetailedError(`Invalid King destination (${move.destination})`, board.printable(), move);
    }
};
exports.ExecuteCastle = ExecuteCastle;
const ExecuteEnPassant = (move, board) => {
    if (!move.prey)
        throw new _interfaces_1.DetailedError("No prey position", board.printable(), move);
    const predatorPosition = BoardUtils_1.default.getPosition(move.predator);
    const preyPosition = BoardUtils_1.default.getPosition(move.prey);
    const destinationPosition = BoardUtils_1.default.getPosition(move.destination);
    const predatorTile = board.getTile(predatorPosition);
    const preyTile = board.getTile(preyPosition);
    const destinationTile = board.getTile(destinationPosition);
    const predator = predatorTile.getPiece();
    if (!predator)
        throw new _interfaces_1.DetailedError(`Tile ${predatorPosition} has no piece!`, board.printable(), move);
    if (preyTile.isEmpty())
        throw new _interfaces_1.DetailedError(`Tile ${preyPosition} has no piece!`, board.printable(), move);
    if (destinationTile.isOccupied())
        throw new _interfaces_1.DetailedError(`Destination ${destinationPosition} has a piece!`, board.printable(), move);
    preyTile.clearPiece();
    predatorTile.clearPiece();
    destinationTile.setPiece(predator);
    predator.setPosition(destinationPosition);
};
exports.ExecuteEnPassant = ExecuteEnPassant;
const ExecutePromote = (move, board) => {
    if (!move.promote)
        throw new _interfaces_1.DetailedError("No promoted selection", board.printable(), move);
    const predatorPosition = BoardUtils_1.default.getPosition(move.predator);
    const destinationPosition = BoardUtils_1.default.getPosition(move.destination);
    const predatorTile = board.getTile(predatorPosition);
    const destinationTile = board.getTile(destinationPosition);
    const predator = predatorTile.getPiece();
    if (!predator)
        throw new _interfaces_1.DetailedError(`Tile ${predatorPosition} has no piece!`, board.printable(), move);
    if (destinationTile.isOccupied()) {
        destinationTile.clearPiece();
    }
    predatorTile.clearPiece();
    let piece;
    switch (move.promote) {
        case "Queen":
            piece = new Queen_1.default(destinationPosition, predator.getTeam(), []);
            break;
        case "Knight":
            piece = new Knight_1.default(destinationPosition, predator.getTeam(), []);
            break;
        case "Bishop":
            piece = new Bishop_1.default(destinationPosition, predator.getTeam(), []);
            break;
        case "Rook":
            piece = new Rook_1.default(destinationPosition, predator.getTeam(), []);
            break;
        default:
            throw new _interfaces_1.DetailedError(`No piece ${move.promote} to be promoted`, board.printable(), move);
    }
    destinationTile.setPiece(piece);
};
exports.ExecutePromote = ExecutePromote;
//# sourceMappingURL=Move.js.map