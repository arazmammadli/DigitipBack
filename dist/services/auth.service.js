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
const token_models_1 = __importDefault(require("@/model/token.models"));
const token_1 = __importDefault(require("@/utils/token"));
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    constructor() {
        this.user = user_model_1.default;
        this.token = token_models_1.default;
    }
    authCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne({ email: email }).exec();
                return user;
            }
            catch (error) {
                throw new Error("Unable to find user with that email address");
            }
        });
    }
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield this.user.findOne({ email }).exec();
                let statusCode;
                if (!currentUser) {
                    const user = yield this.user.create({
                        name,
                        email,
                        password,
                    });
                    const accessToken = token_1.default.createToken(user);
                    return { accessToken };
                }
                else {
                    statusCode = 409;
                    return { statusCode };
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    throw new Error("Please enter email & password");
                }
                const user = yield this.user.findOne({ email }).exec();
                if (!user) {
                    throw new Error("Unable to find user with that email address");
                }
                if ((yield user.isValidPassword(password)) && user.isActive === true) {
                    return token_1.default.createToken(user);
                }
                else if (user.isActive === false) {
                    return "false";
                }
                else {
                    throw new Error('Wrong credentials given');
                }
            }
            catch (error) {
                throw new Error('Unable to create user');
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    throw new Error("Please enter email & password");
                }
                const user = yield this.user.findOne({ email }).exec();
                if (!user) {
                    throw new Error("Unable to find user with that email address");
                }
                if ((yield user.isValidPassword(password)) && user.roles.includes("Admin")) {
                    return token_1.default.createToken(user);
                }
                else {
                    throw new Error("Wrong credentials given");
                }
            }
            catch (error) {
                throw new Error("Unable to create user");
            }
        });
    }
    forgotPassword(email, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne({ email }).exec();
                if (!user) {
                    res.status(404);
                    throw new Error("User does not exist");
                }
                let currentToken = yield this.token.findOne({ userId: user._id }).exec();
                if (currentToken) {
                    yield this.token.deleteOne();
                }
                // Create Reset Token
                let resetToken = crypto_1.default.randomBytes(32).toString("hex") + user._id;
                const hashedToken = crypto_1.default
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");
                // Save Token to DB
                yield new token_models_1.default({
                    userId: user._id,
                    token: hashedToken,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 30 * (60 * 1000)
                }).save();
                // Construct Reset Url
                const resetUrl = `${process.env.FRONTEND_URL}/reset/password/${resetToken}`;
                return { user, resetUrl };
            }
            catch (error) {
                new Error("Email not sent, please try again");
            }
        });
    }
    resetPassword(password, resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedToken = crypto_1.default
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");
                // finf token in DB
                const userToken = yield this.token.findOne({
                    token: hashedToken,
                    expiresAt: { $gt: Date.now() },
                }).exec();
                if (!userToken) {
                    throw new Error("Invalid or Expired Token");
                }
                // Find user
                const user = yield this.user.findOne({ _id: userToken.userId });
                if (user) {
                    user.password = password;
                    yield user.save();
                    return user.email;
                }
            }
            catch (error) {
                throw new Error("an error occured");
            }
        });
    }
}
;
exports.default = AuthService;
