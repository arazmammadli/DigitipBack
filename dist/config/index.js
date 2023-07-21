"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    GOOGLE_CLIENTID: process.env.GOOGLE_CLIENTID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
};
exports.default = config;
