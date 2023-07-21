"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generatePin(count) {
    const min = 0;
    const max = 999999999;
    return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(count);
}
;
exports.default = generatePin;
