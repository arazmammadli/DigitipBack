"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const partnerSchema = new mongoose_1.Schema({
    partnerImg: {
        type: String,
        required: [true, "Please enter partner image"],
        unique: true
    },
    partnerImgName: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Partner", partnerSchema);
