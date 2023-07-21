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
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
const partner_service_1 = __importDefault(require("@/services/partner.service"));
class PartnerController {
    constructor() {
        this.path = "/partners";
        this.router = (0, express_1.Router)();
        this.PartnerService = new partner_service_1.default();
        this.createPartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerImg, partnerImgName } = req.body;
                const result = yield this.PartnerService.createPartner(partnerImg, partnerImgName);
                if (result.statusCode === undefined) {
                    return res
                        .status(201)
                        .json({ message: "Partner created successful.", success: true });
                }
                else {
                    return res.status(result.statusCode).json({ message: "This partner image is already created" });
                }
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getAllPartners = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const partners = yield this.PartnerService.getAllPartners();
                res
                    .status(200)
                    .json(partners);
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getPartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId } = req.params;
                const partner = yield this.PartnerService.getPartner(partnerId);
                res
                    .status(200)
                    .json(partner);
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.deletePartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId } = req.body;
                const result = yield this.PartnerService.deletePartner(partnerId);
                res
                    .status(200)
                    .json(Object.assign({ message: "Partner deleted succesful" }, result));
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.updatePartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, file, partnerImgName } = req.body;
                const updatePartner = yield this.PartnerService.updatePartner(id, file, partnerImgName);
                res
                    .status(200)
                    .json(Object.assign({ message: "Partner update successful" }, updatePartner));
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.route(`${this.path}`)
            .get(authenticated_middleware_1.default, this.getAllPartners)
            .post(authenticated_middleware_1.default, this.createPartner)
            .delete(authenticated_middleware_1.default, this.deletePartner)
            .put(authenticated_middleware_1.default, this.updatePartner);
        this.router.get(`${this.path}/:partnerId`, authenticated_middleware_1.default, this.getPartner);
    }
}
;
exports.default = PartnerController;
