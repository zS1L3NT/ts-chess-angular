"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEPTS = exports.ValidateDepth = exports.ValidateBoardBody = exports.ValidateTeamParam = exports.ConvertPiece = void 0;
const BoardUtils_1 = __importDefault(require("./board/BoardUtils"));
const Team_1 = __importDefault(require("./board/Team"));
const Bishop_1 = __importDefault(require("./pieces/Bishop"));
const King_1 = __importDefault(require("./pieces/King"));
const Knight_1 = __importDefault(require("./pieces/Knight"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const Queen_1 = __importDefault(require("./pieces/Queen"));
const Rook_1 = __importDefault(require("./pieces/Rook"));
const ConvertPiece = (piece) => {
    const position = BoardUtils_1.default.getPosition(piece.boardCode);
    const team = new Team_1.default(piece.team);
    switch (piece.type) {
        case "King":
            return new King_1.default(position, team, piece.history);
        case "Queen":
            return new Queen_1.default(position, team, piece.history);
        case "Rook":
            return new Rook_1.default(position, team, piece.history);
        case "Bishop":
            return new Bishop_1.default(position, team, piece.history);
        case "Knight":
            return new Knight_1.default(position, team, piece.history);
        case "Pawn":
            return new Pawn_1.default(position, team, piece.history);
    }
};
exports.ConvertPiece = ConvertPiece;
const ValidateTeamParam = (res, team) => {
    if (!team) {
        res.status(400).send(`Must provide 'team' parameter`);
        return;
    }
    if (typeof team !== "string" || !team.match(/^white|black$/)) {
        res.status(400).send(`Team must be a string of 'white' or 'black' but got ${team}`);
        return;
    }
    return team;
};
exports.ValidateTeamParam = ValidateTeamParam;
const ValidateBoardBody = (res, board) => {
    if (!board) {
        res.status(400).send(`Must provide 'board' body`);
        return;
    }
    for (let i = 0, il = board.length; i < il; i++) {
        const piece = board[i];
        if (!piece) {
            res.status(400).send(`Must provide 'piece' in 'board' body`);
            return;
        }
        if (typeof piece.type !== "string" ||
            !piece.type.match(/^King|Queen|Rook|Bishop|Knight|Pawn/)) {
            res.status(400).send(`Piece at index (${i}) must have a proprerty 'type' of type "King" | "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn"`);
            return;
        }
        if (typeof piece.boardCode !== "string") {
            res.status(400).send(`Piece at index (${i}) must have a property 'boardCode' of type string`);
            return;
        }
        if (typeof piece.team !== "string") {
            res.status(400).send(`Piece at index (${i}) must have a property 'team' of type string`);
            return;
        }
        if (typeof piece.history !== "object" ||
            (JSON.stringify(piece.history) !== "[]" &&
                typeof piece.history[0] !== "string")) {
            res.status(400).send(`Piece at index (${i}) must have a property 'history' of type string[]`);
            return;
        }
    }
    return board;
};
exports.ValidateBoardBody = ValidateBoardBody;
const ValidateDepth = (res, depth) => {
    if (typeof depth !== "number") {
        res.status(400).send(`depth must be a number but got (${depth})`);
    }
    return depth;
};
exports.ValidateDepth = ValidateDepth;
const ValidateEPTS = (res, epts) => {
    if (typeof epts !== "string") {
        res.status(400).send(`epts must be a string or empty but got (${epts})`);
        return;
    }
    if (!epts)
        return epts;
    if (!epts.match(/^[A-H][1-8]$/)) {
        res.status(400).send(`epts must be a string of a board codebut got (${epts})`);
        return;
    }
    return epts;
};
exports.ValidateEPTS = ValidateEPTS;
//# sourceMappingURL=conversions.js.map