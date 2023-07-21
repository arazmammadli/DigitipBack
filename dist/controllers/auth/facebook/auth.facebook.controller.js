"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
class FbController {
    constructor() {
        this.path = '/auth/facebook';
        this.router = (0, express_1.Router)();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, passport_1.default.authenticate('facebook', { scope: ['profile', 'email'] }));
        this.router.get(`${this.path}/callback`, (req, res, next) => {
            passport_1.default.authenticate('facebook', {
                failureRedirect: process.env.FACEBOOK_AUTH_FAILURE_REDIRECT,
            }, (err, user, info) => {
                if (err || !user) {
                    return res.redirect(process.env
                        .FACEBOOK_AUTH_FAILURE_REDIRECT);
                }
                const { accessToken } = info;
                return res
                    .cookie('accessToken', accessToken, {
                    maxAge: 1000 * 60 * 60,
                })
                    .redirect(process.env
                    .FACEBOOK_AUTH_SUCCESS_REDIRECT);
            })(req, res, next);
        });
    }
}
exports.default = FbController;
