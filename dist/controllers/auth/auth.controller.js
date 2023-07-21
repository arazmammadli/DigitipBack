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
const express_1 = require("express");
const auth_service_1 = __importDefault(require("@/services/auth.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const validation_middleware_1 = __importDefault(require("@/middleware/validation.middleware"));
const user_validation_1 = __importDefault(require("@/utils/validations/user.validation"));
const send_email_1 = __importDefault(require("@/utils/send.email"));
class AuthController {
    constructor() {
        this.path = "/auth";
        this.router = (0, express_1.Router)();
        this.AuthService = new auth_service_1.default();
        this.authCheck = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.AuthService.authCheck(email);
                if (user) {
                    res.status(302).json({ success: true });
                }
                else {
                    res.status(302).json({ success: false });
                }
            }
            catch (error) {
                next(new http_exception_1.default(401, error.message));
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, repeatPassword } = req.body;
                if (password === repeatPassword) {
                    const { accessToken, statusCode } = yield this.AuthService.register(name, email, password);
                    if (accessToken) {
                        yield (0, send_email_1.default)({
                            emailFrom: process.env.EMAIL_USERNAME || "",
                            emailTo: email,
                            subject: "Digitip registration!",
                            message: "Your Digitip registration has been successfully completed!"
                        });
                        res
                            .status(201)
                            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                            .json({ token: accessToken, "success": true });
                    }
                    else {
                        return res.status(statusCode).json({ message: "This email is already registered" });
                    }
                }
                else {
                    res.status(404).json({ error: "Please fill in the fields correctly" });
                }
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, email } = req.body;
                const token = yield this.AuthService.login(email, password);
                if (token === "false") {
                    return res.status(403).json({ message: "Your account has been disabled by admin." });
                }
                else {
                    return res
                        .status(200)
                        .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 })
                        .json({ token, "success": true });
                }
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.adminLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, email } = req.body;
                const token = yield this.AuthService.adminLogin(email, password);
                res
                    .status(200)
                    .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 })
                    .json({ token, "success": true });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                if (!cookies.accessToken)
                    throw new Error("No content"); // No content
                const cookiesArr = ['accessToken', "connect.sid"];
                for (let cookie of cookiesArr) {
                    res.clearCookie(cookie);
                }
                ;
                req.session.destroy((err) => {
                    if (!err)
                        res.status(200);
                });
                req.logout((err) => {
                    res.json({ message: "Log out successed." });
                });
            }
            catch (error) {
                next(new http_exception_1.default(204, error.message));
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const forgotData = yield this.AuthService.forgotPassword(email, res);
            // Reset email
            const message = {
                message: `
            <h2>Hello ${forgotData === null || forgotData === void 0 ? void 0 : forgotData.user.name}</h2>
            <p>Please use the url below to reset your password</p>  
            <p>This reset link is valid for only 30minutes.</p>
            <a href=${forgotData === null || forgotData === void 0 ? void 0 : forgotData.resetUrl} clicktracking=off>${forgotData === null || forgotData === void 0 ? void 0 : forgotData.resetUrl}</a>
            <p>Regards...</p>
            <p>Pinvent Team</p>
          `,
                subject: "Password Reset Request",
                emailTo: email,
                emailFrom: process.env.EMAIL_USERNAME || ""
            };
            try {
                yield (0, send_email_1.default)(message);
                res
                    .status(200)
                    .json({ success: true, message: "Reset Email Send" });
            }
            catch (error) {
                next(new http_exception_1.default(500, error.message));
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, verifyPassword } = req.body;
                const { resetToken } = req.params;
                if (password === verifyPassword) {
                    const result = yield this.AuthService.resetPassword(password, resetToken);
                    res
                        .status(200)
                        .json({
                        email: result,
                        message: "Password Reset Successful, Please Login",
                    });
                }
                else {
                    res.status(400).json({ error: "Please fill in the fields correctly" });
                }
            }
            catch (error) {
                next(new http_exception_1.default(500, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/check`, (0, validation_middleware_1.default)(user_validation_1.default.authCheck), this.authCheck);
        this.router.post(`${this.path}/signup`, (0, validation_middleware_1.default)(user_validation_1.default.register), this.register);
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.default)(user_validation_1.default.login), this.login);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/forgotpassword`, (0, validation_middleware_1.default)(user_validation_1.default.forgotPassword), this.forgotPassword);
        this.router.post(`${this.path}/resetpassword/:resetToken`, (0, validation_middleware_1.default)(user_validation_1.default.resetPassowrd), this.resetPassword);
        this.router.post(`${this.path}/adminlogin`, (0, validation_middleware_1.default)(user_validation_1.default.login), this.adminLogin);
    }
}
;
exports.default = AuthController;
