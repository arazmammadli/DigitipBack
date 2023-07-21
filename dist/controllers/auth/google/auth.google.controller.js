"use strict";
// import Controller from "@/utils/interfaces/controller.interface";
// import { NextFunction, Request, Response, Router } from "express";
// import passport from "passport";
// import GoogleService from "@/services/google/auth.gogle.service";
// import HttpException from "@/utils/exceptions/http.exception";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
class GoogleAuthController {
    constructor() {
        this.path = "/auth/google";
        this.router = (0, express_1.Router)();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
        this.router.get(`${this.path}/callback`, (req, res, next) => {
            passport_1.default.authenticate("google", {
                failureRedirect: process.env.GOOGLE_AUTH_FAILURE_REDIRECT
            }, (err, user, info) => {
                if (err || !user) {
                    return res.redirect(process.env.GOOGLE_AUTH_FAILURE_REDIRECT);
                }
                const { accessToken } = info;
                return res
                    .cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 })
                    .redirect(process.env.GOOGLE_AUTH_SUCCESS_REDIRECT);
            })(req, res, next);
        });
    }
}
;
exports.default = GoogleAuthController;
