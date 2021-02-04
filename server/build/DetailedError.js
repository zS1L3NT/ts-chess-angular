"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DetailedError extends Error {
    constructor(message, ...items) {
        console.log("\n📕 Error details:");
        console.log(...items);
        super(message);
    }
}
exports.default = DetailedError;
//# sourceMappingURL=DetailedError.js.map