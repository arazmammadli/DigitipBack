import { Document,Types } from "mongoose";

export default interface Partner extends Document {
    _id:Types.ObjectId,
    partnerImg:string,
    partnerImgName:string,
    createdAt:string
}