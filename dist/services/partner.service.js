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
const partners_model_1 = __importDefault(require("@/model/partners.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
class PartnerService {
    constructor() {
        this.partner = partners_model_1.default;
    }
    createPartner(file, partnerImgName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!partnerImgName) {
                throw new Error("Partner img name required.");
            }
            const partner = yield this.partner.findOne({ partnerImg: file }).exec();
            let statusCode;
            if (!partner) {
                const result = yield cloudinary_1.default.v2.uploader.upload(file, {
                    folder: "partners"
                });
                const newPartner = yield this.partner.create({
                    partnerImg: result.secure_url,
                    partnerImgName: partnerImgName
                });
                return newPartner;
            }
            else {
                statusCode = 409;
                throw new Error("The same image cannot be added twice");
            }
        });
    }
    getAllPartners() {
        return __awaiter(this, void 0, void 0, function* () {
            const partners = yield this.partner.find({});
            if (!partners) {
                throw new Error("No partners found.");
            }
            return partners;
        });
    }
    getPartner(partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!partnerId) {
                    throw new Error("Partner Id required");
                }
                const partner = yield this.partner.findOne({ _id: partnerId }).exec();
                if (partner) {
                    return partner;
                }
            }
            catch (error) {
                throw new Error("Partner Not Found");
            }
        });
    }
    deletePartner(partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!partnerId) {
                throw new Error("Partner ID required");
            }
            const partner = yield this.partner.findOne({ _id: partnerId }).exec();
            if (!partner) {
                throw new Error(`No partner matches ID ${partnerId}`);
            }
            const result = yield partner.deleteOne({ _id: partnerId });
            return result;
        });
    }
    updatePartner(id, file, partnerImgName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!partnerImgName) {
                throw new Error("Partner img name required!");
            }
            const partner = yield this.partner.findById(id);
            if (partner) {
                let result;
                if (file && file !== partner.partnerImg) {
                    result = yield cloudinary_1.default.v2.uploader.upload(file, {
                        folder: "partners",
                    });
                }
                ;
                partner.partnerImg = file !== partner.partnerImg ? result === null || result === void 0 ? void 0 : result.secure_url : partner.partnerImg;
                partner.partnerImgName = file !== partner.partnerImg ? partnerImgName : partner.partnerImgName;
                const updatePartner = yield partner.save();
                return updatePartner;
            }
            else {
                throw new Error("Partner not found");
            }
        });
    }
}
;
exports.default = PartnerService;
