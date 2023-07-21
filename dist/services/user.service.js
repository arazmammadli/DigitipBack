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
const cloudinary_1 = __importDefault(require("cloudinary"));
class UserService {
    constructor() {
        this.user = user_model_1.default;
    }
    getShowMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne({ _id: userId }).exec();
                if (user) {
                    return user;
                }
            }
            catch (error) {
                throw new Error("User Not Found");
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error("User ID required");
                }
                const user = yield this.user.findOne({ _id: userId }).exec();
                if (user) {
                    return user;
                }
            }
            catch (error) {
                throw new Error("User Not Found");
            }
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.user.find({});
            if (!users) {
                throw new Error("No users found.");
            }
            return users;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID required");
            }
            const user = yield this.user.findOne({ _id: userId }).exec();
            if (!user) {
                throw new Error(`User ID ${userId} not found.`);
            }
            const result = yield user.deleteOne({ _id: userId });
            return result;
        });
    }
    deactiveUser(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("user ID and status required");
            }
            const user = yield this.user.findOne({ _id: userId }).exec();
            if (!user) {
                throw new Error(`User ID ${userId} not found`);
            }
            user.isActive = status === 0 ? true : false;
            const updateUser = yield user.save();
            return updateUser;
        });
    }
    editUser(name, surname, file, position, phone, nameSystem, workAddress, aboutMe, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(id);
            if (user) {
                let result;
                if (file && file !== user.userImg) {
                    result = yield cloudinary_1.default.v2.uploader.upload(file, {
                        folder: "images",
                    });
                }
                user.name = name;
                user.userImg = file !== user.userImg ? result === null || result === void 0 ? void 0 : result.secure_url : user.userImg;
                user.surname = surname;
                user.position = position;
                user.phone = phone;
                user.nameSystem = nameSystem;
                user.workAddress = workAddress;
                user.aboutMe = aboutMe;
                const updateUser = yield user.save();
                return updateUser;
            }
            else {
                throw new Error("User not found");
            }
        });
    }
}
;
exports.default = UserService;
