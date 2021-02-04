"use strict";
class Parser {
    /**
     * @param {string} code
     */
    constructor(code) {
        this.code = "";
        this.predator = "";
        this.action = "moves to";
        this.location = "";
        this.checks = false;
        this.mates = false;
        this.promotes = "";
        /**
         * Handles checks
         */
        if (code.slice(code.length - 1) === "+") {
            code = code.slice(0, code.length - 1);
            this.checks = true;
        }
        /**
         * Handles checkmates
         */
        if (code.slice(code.length - 1) === "#") {
            code = code.slice(0, code.length - 1);
            this.mates = true;
        }
        this.code = code;
        /**
         * Handles castling
         */
        if (code === "O-O-O" || code === "O-O") {
            return;
        }
        /**
         * Handles attacks
         */
        if (code.indexOf("x") > 0) {
            this.fillPredator(code.slice(0, code.indexOf("x")));
            this.fillLocation(code.slice(code.indexOf("x") + 1));
            this.action = "captures a piece on";
            return;
        }
        /**
         * Handles promotions
         */
        if (code.indexOf("=") > 0) {
            if (!this.isTile(code.slice(0, 2))) {
                throw new Error(`(${this.code}): ${code.slice(0, 2)} is not a tile`);
            }
            if (!this.getFullname(code[3])) {
                throw new Error(`(${this.code}): ${code[3]} is not a piece`);
            }
            this.predator = "Pawn";
            this.location = code.slice(0, 2);
        }
        /**
         * Handles moves
         * Rc1
         * Rac1
         */
        if (this.isUppercase(code[0]) &&
            this.isTile(code.slice(code.length - 2))) {
            this.predator =
                this.getFullname(code[0]) +
                    (code.length === 4 ? ` on ${this.fileOrRank(code[1])}` : "");
            this.location = code.slice(code.length - 2);
            return;
        }
        if (this.isTile(code)) {
            this.predator = "Pawn";
            this.location = code;
            return;
        }
    }
    /**
     * Fill's the predator
     * Handles special cases
     * @param {string} name
     */
    fillPredator(name) {
        if (name.length === 1) {
            if (!name.match(/^[BNRQKabcdefgh]$/)) {
                throw new Error(`(${this.code}): No such file ${name}`);
            }
            this.predator = this.getFullname(name) || `Pawn in column ${name}`;
            return;
        }
        if (this.getFullname(name[0]) &&
            name.slice(1).match(/^[abcdefgh12345678]$/)) {
            this.predator = `${this.getFullname(name[0])} on ${this.fileOrRank(name[1])}`;
            return;
        }
        if (this.getFullname(name[0]) && this.isTile(name.slice(1))) {
            this.predator = `${this.getFullname(name[0])} on ${name.slice(1)}`;
            return;
        }
        throw new Error(`(${this.code}): Didn't fill predator with name: ${name}`);
    }
    /**
     * Fill's the target
     * Handles promiton as well
     * @param {*} name
     */
    fillLocation(name) {
        if (name.indexOf("=") > 0) {
            if (!this.isTile(name.slice(0, 2))) {
                throw new Error(`(${this.code}): ${name.slice(0, 2)} is not a tile`);
            }
            if (!this.getFullname(name[3])) {
                throw new Error(`(${this.code}): ${name[3]} is not a piece`);
            }
            this.location = name.slice(0, 2);
            this.promotes = this.getFullname(name[3]);
            return;
        }
        if (!this.isTile(name)) {
            throw new Error(`(${this.code}): Could not parse location ${name}`);
        }
        this.location = name;
    }
    /**
     * Regex test for board code
     * @param {string} chars Board code
     * @return {boolean} True if chars are a tile
     */
    isTile(chars) {
        return chars.match(/^[abcdefgh]{1}[12345678]{1}$/);
    }
    /**
     * Tests if a character is uppercase
     * @param {string} char Character
     */
    isUppercase(char) {
        return char === char.toUpperCase();
    }
    /**
     * Get's the fullname of a Piece
     * @param {srting} char One character defining the piece
     * @return {string | undefined} Fullname
     */
    getFullname(char) {
        if (char !== "B" &&
            char !== "N" &&
            char !== "R" &&
            char !== "Q" &&
            char !== "K")
            throw new Error(`Character ${char} not found`);
        const all = {
            B: "Bishop",
            N: "Knight",
            R: "Rook",
            Q: "Queen",
            K: "King"
        };
        return all[char];
    }
    fileOrRank(char) {
        return parseInt(char) ? `rank ${char}` : `${char}-file`;
    }
    simplify() {
        if (this.code === "O-O-O")
            return "Queenside castle";
        if (this.code === "O-O")
            return "Kingside castle";
        if (!this.predator)
            throw new Error(`(${this.code}): Predator is empty!`);
        if (!this.location)
            throw new Error(`(${this.location}): Location is empty!`);
        const kingstate = this.checks || this.mates
            ? ` and ${this.checks ? "checks" : "checkmates"}`
            : "";
        const promotestate = this.promotes
            ? ` and promotes to a ${this.promotes}`
            : "";
        return `${this.predator} ${this.action} ${this.location}${promotestate}${kingstate}`;
    }
}
// const database = require("./database.json")
// let count = 0
// database.slice(10000, 10300).map(code => {
// 	console.log(code, new Parser(code).simplify())
// 	count++
// })
// console.log(`Read ${count} moves successfully ✔️`)
// x
console.log(new Parser("Rac1").simplify());
//# sourceMappingURL=Parser.test.js.map