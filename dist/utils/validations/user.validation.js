"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    repeatPassword: joi_1.default.string().required()
});
const authCheck = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
const login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
const forgotPassword = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
const resetPassowrd = joi_1.default.object({
    password: joi_1.default.string().required(),
    verifyPassword: joi_1.default.string().required()
});
exports.default = { register, login, authCheck, forgotPassword, resetPassowrd };
