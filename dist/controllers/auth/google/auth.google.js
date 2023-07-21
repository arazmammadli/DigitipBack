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
const user_model_1 = __importDefault(require("@/model/user.model"));
const index_1 = __importDefault(require("../../../config/index"));
const express_1 = require("express");
const passport_google_oauth20_1 = require("passport-google-oauth20");
class GoogleController {
    constructor() {
        this.path = "/auth/google";
        this.router = (0, express_1.Router)();
        this.a = (req, res, next) => {
            console.log("Aasd");
            res.send("<a href='http://localhost:5000/auth/google'>Login with Google</a>");
            next();
        };
        this.googleAuth = (passport) => {
            passport.use(new passport_google_oauth20_1.Strategy({
                clientID: index_1.default.GOOGLE_CLIENTID || "",
                clientSecret: index_1.default.GOOGLE_CLIENT_SECRET || "",
                callbackURL: index_1.default.GOOGLE_OAUTH_REDIRECT_URI || ""
            }, (accessToken, profile, callback) => __awaiter(this, void 0, void 0, function* () {
                console.log(profile);
            }))),
                passport.serializeUser((user, callback) => {
                    callback(null, user.id);
                });
            passport.deserializeUser((id, callback) => {
                user_model_1.default.findById(id, (err, user) => {
                    callback(err, user);
                });
            });
        };
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, this.a);
    }
}
;
exports.default = GoogleController;
