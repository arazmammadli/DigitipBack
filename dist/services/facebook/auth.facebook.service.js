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
exports.facebookAuth = void 0;
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = __importDefault(require("@/model/user.model"));
const token_1 = __importDefault(require("@/utils/token"));
const facebookAuth = (passport) => {
    passport.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_CLIENT_ID || "",
        clientSecret: process.env.FACEBOOK_APP_SECRET || "",
        callbackURL: process.env.FACEBOOK_OAUTH_REDIRECT_URI || ""
    }, function (_, __, profile, cb) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ uId: profile.id }).exec();
            if (!user) {
                // create new user
                const password = profile.emails ? profile.emails[0].value + process.env.FACEBOOK_APP_SECRET : "";
                const newUser = yield user_model_1.default.create({
                    uId: profile.id,
                    name: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                    surname: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                    email: profile.emails ? profile.emails[0].value : "",
                    userImg: profile.photos ? profile.photos[0].value : "",
                    password: password
                });
                const accessToken = token_1.default.createToken(newUser);
                return cb(null, newUser, { message: "Facebook auth successful", accessToken: accessToken });
            }
            else {
                const accessToken = token_1.default.createToken(user);
                return cb(null, user, { message: "Facebook auth successful", accessToken: accessToken });
            }
        });
    }));
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(id);
        done(null, user);
    }));
};
exports.facebookAuth = facebookAuth;
