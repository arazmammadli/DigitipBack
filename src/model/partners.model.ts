import { Schema, model } from "mongoose";
import Partner from "@/utils/interfaces/partners.interface";

const partnerSchema = new Schema({
    partnerImg: {
        type: String,
        required: [true, "Please enter partner image"],
        unique:true
    },
    partnerImgName:{
        type:String,
        required:true
    }
}, { timestamps: true });

export default model<Partner>("Partner", partnerSchema);