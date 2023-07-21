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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("@/services/user.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
const verify_roles_1 = __importDefault(require("@/middleware/verify.roles"));
class UserController {
    constructor() {
        this.path = "/users";
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.getShowMe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return next(new http_exception_1.default(404, 'No logged in user'));
                }
                const { _id: userId } = req.user;
                const user = yield this.UserService.getShowMe(userId);
                const _a = user === null || user === void 0 ? void 0 : user._doc, { password } = _a, userData = __rest(_a, ["password"]);
                res
                    .status(200)
                    .json(Object.assign({}, userData));
            }
            catch (error) {
                next(new http_exception_1.default(400, error.mesage));
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.UserService.getUser(userId);
                res
                    .status(200)
                    .json(user);
            }
            catch (error) {
                next(new http_exception_1.default(400, "User Not Found"));
            }
        });
        this.getAllUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.UserService.getAllUser();
                res
                    .status(200)
                    .json(users);
            }
            catch (error) {
                next(new http_exception_1.default(204, error.message));
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const result = yield this.UserService.deleteUser(userId);
                res
                    .status(200)
                    .json(result);
            }
            catch (error) {
                next(new http_exception_1.default(500, error.message));
            }
        });
        this.deactiveUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, status } = req.body;
                console.log(userId);
                const result = yield this.UserService.deactiveUser(userId, status);
                if (result) {
                    res
                        .status(200)
                        .json(Object.assign({ message: "Successful." }, result));
                }
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.editUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, surname, file, position, phone, nameSystem, workAddress, aboutMe, id } = req.body;
                const updateUser = yield this.UserService.editUser(name, surname, file, position, phone, nameSystem, workAddress, aboutMe, id);
                res
                    .status(200)
                    .json(updateUser);
            }
            catch (error) {
                next(new http_exception_1.default(404, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, authenticated_middleware_1.default, this.getAllUser);
        this.router.get("/user/me", authenticated_middleware_1.default, this.getShowMe);
        this.router.get(`${this.path}/:userId`, authenticated_middleware_1.default, (0, verify_roles_1.default)("Admin"), this.getUser);
        this.router.delete(`${this.path}`, authenticated_middleware_1.default, (0, verify_roles_1.default)("Admin"), this.deleteUser);
        this.router.put(`${this.path}/change-status`, authenticated_middleware_1.default, this.deactiveUser);
        this.router.put("/user/me", authenticated_middleware_1.default, this.editUser);
    }
}
;
exports.default = UserController;
