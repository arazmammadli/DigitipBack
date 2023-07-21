"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const auth_controller_1 = __importDefault(require("@/controllers/auth/auth.controller"));
const user_controller_1 = __importDefault(require("@/controllers/user/user.controller"));
const auth_google_controller_1 = __importDefault(require("@/controllers/auth/google/auth.google.controller"));
const auth_facebook_controller_1 = __importDefault(require("@/controllers/auth/facebook/auth.facebook.controller"));
const partner_controller_1 = __importDefault(require("@/controllers/partner/partner.controller"));
const app = new app_1.default([
    new auth_controller_1.default(),
    new user_controller_1.default(),
    new auth_google_controller_1.default(),
    new auth_facebook_controller_1.default(),
    new partner_controller_1.default(),
], Number(process.env.PORT) || 3000);
app.listen();
