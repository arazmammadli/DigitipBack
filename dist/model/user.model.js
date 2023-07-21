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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const qrcode_1 = __importDefault(require("qrcode"));
const userPinGenerete_1 = __importDefault(require("@/utils/userPinGenerete"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    surname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [false, 'Please enter your password'],
    },
    position: {
        type: String,
        required: false
    },
    userImg: {
        type: String,
        required: false
    },
    uId: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    nameSystem: {
        type: String,
        required: false
    },
    workAddress: {
        type: String,
        reuqired: false
    },
    aboutMe: {
        type: String,
        required: false
    },
    roles: {
        type: [String],
        default: ["User"]
    },
    qrCode: {
        type: String,
        reuqired: true
    },
    userId: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(this.password, salt);
        const qrcode = yield qrcode_1.default.toDataURL(this.name, { width: 295, type: "image/png", errorCorrectionLevel: "H" });
        const uniqId = (0, userPinGenerete_1.default)(-9);
        this.password = hash;
        this.qrCode = qrcode;
        this.userId = uniqId;
        next();
    });
});
userSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = (0, mongoose_1.model)("User", userSchema);
