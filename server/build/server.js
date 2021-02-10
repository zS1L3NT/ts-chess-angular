"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Board_1 = __importDefault(require("./board/Board"));
const BoardUtils_1 = __importDefault(require("./board/BoardUtils"));
const Team_1 = __importDefault(require("./board/Team"));
const Tile_1 = __importDefault(require("./board/Tile"));
const conversions_1 = require("./conversions");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const movemaker_1 = __importDefault(require("./movemaker"));
const database_1 = __importDefault(require("./movemaker/database"));
const app = express_1.default();
const PORT = process.env.PORT || 5000;
/**
 * Initialise database
 */
const database = {
    wins: {
        white: 0,
        black: 0,
        draw: 0,
        total: 0
    }
};
console.log("Adding files to database...");
const start = new Date().getTime();
const fileNames = fs_1.default.readdirSync(path_1.default.join(__dirname, "movemaker", "PGNs"));
fileNames.forEach(fileName => {
    const file = fs_1.default.readFileSync(path_1.default.join(__dirname, "movemaker", "PGNs", fileName), {
        encoding: "utf8"
    });
    database_1.default(database, file);
});
console.log(`Files added successfully (${new Date().getTime() - start}ms) ✔️`);
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post("/api/getAllSafeMoves", (req, res) => {
    const { board: boardUnverified, epts: eptsUnverified } = req.body;
    const board = conversions_1.ValidateBoardBody(res, boardUnverified);
    const epts = conversions_1.ValidateEPTS(res, eptsUnverified);
    if (!board || typeof epts !== "string")
        return undefined;
    const map = Array.from(Array(64).keys()).map(i => new Tile_1.default(i, null));
    for (let i = 0, il = board.length; i < il; i++) {
        const piece = board[i];
        const position = BoardUtils_1.default.getPosition(piece.boardCode);
        if (map[position].isOccupied())
            return res
                .status(400)
                .send(`Two pieces have the same position of ${piece.boardCode}`);
        map[position].setPiece(conversions_1.ConvertPiece(piece));
    }
    const game = new Board_1.default(epts, map);
    res.send({
        white: new Team_1.default("white")
            .getAllSafeMoves(game)
            .map(move => conversions_1.addNotation(game, move)),
        black: new Team_1.default("black")
            .getAllSafeMoves(game)
            .map(move => conversions_1.addNotation(game, move))
    });
});
app.post("/api/getComputerMove/:team", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getComputerMove...");
    console.time("getComputerMove");
    const { board: boardUnverified, epts: eptsUnverified, depth: depthUnverified, history: historyUnverified } = req.body;
    const { team: teamUnverified } = req.params;
    const board = conversions_1.ValidateBoardBody(res, boardUnverified);
    const epts = conversions_1.ValidateEPTS(res, eptsUnverified);
    const depth = conversions_1.ValidateDepth(res, depthUnverified);
    const history = conversions_1.ValidateHistory(res, historyUnverified);
    const team = conversions_1.ValidateTeamParam(res, teamUnverified);
    if (!team || !board || typeof epts !== "string" || !depth || !history)
        return undefined;
    const map = Array.from(Array(64).keys()).map(i => new Tile_1.default(i, null));
    for (let i = 0, il = board.length; i < il; i++) {
        const piece = board[i];
        const position = BoardUtils_1.default.getPosition(piece.boardCode);
        if (map[position].isOccupied())
            return res
                .status(400)
                .send(`Two pieces have the same position of ${piece.boardCode}`);
        map[position].setPiece(conversions_1.ConvertPiece(piece));
    }
    const game = new Board_1.default(epts, map);
    res.send(conversions_1.addNotation(game, movemaker_1.default(database, game, depth, history, team)));
    console.timeEnd("getComputerMove");
}));
app.post("/api/getGameStatus", (req, res) => {
    const { board: boardUnverified, epts: eptsUnverified } = req.body;
    const board = conversions_1.ValidateBoardBody(res, boardUnverified);
    const epts = conversions_1.ValidateEPTS(res, eptsUnverified);
    if (!board || typeof epts !== "string")
        return undefined;
    const map = Array.from(Array(64).keys()).map(i => new Tile_1.default(i, null));
    for (let i = 0, il = board.length; i < il; i++) {
        const piece = board[i];
        const position = BoardUtils_1.default.getPosition(piece.boardCode);
        if (map[position].isOccupied())
            return res
                .status(400)
                .send(`Two pieces have the same position of ${piece.boardCode}`);
        map[position].setPiece(conversions_1.ConvertPiece(piece));
    }
    const game = new Board_1.default(epts, map);
    const white = new Team_1.default("white");
    const black = new Team_1.default("black");
    const whiteMoves = white.getAllSafeMoves(game);
    const blackMoves = black.getAllSafeMoves(game);
    if (whiteMoves.length > 0 && blackMoves.length > 0) {
        res.status(400).send("Both players have moves!");
    }
    if (whiteMoves.length === 0 && blackMoves.length === 0) {
        res.status(400).send("How can both teams have no moves?");
    }
    if (whiteMoves.length > 0 && blackMoves.length === 0) {
        if (black.isKingSafe(game)) {
            res.status(200).send({ status: "draw" });
        }
        else {
            res.status(200).send({ status: "white" });
        }
    }
    if (whiteMoves.length === 0 && blackMoves.length > 0) {
        if (white.isKingSafe(game)) {
            res.status(200).send({ status: "draw" });
        }
        else {
            res.status(200).send({ status: "black" });
        }
    }
});
app.post("/api/database", (req, res) => {
    const file = req.body.file;
    if (!file)
        return res.status(400).send("No file data");
    database_1.default(database, file);
    res.status(200).send("Done at " + new Date());
});
app.use(express_1.default.static(path_1.default.resolve(__dirname, "..", "..", "client", "dist")));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "..", "..", "client", "dist", "index.html"));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map