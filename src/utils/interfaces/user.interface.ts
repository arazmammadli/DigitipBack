import { Document, Types } from "mongoose";

export default interface User extends Document {
    _id:Types.ObjectId;
    name: string;
    surname?: string;
    email: string;
    password: string;
    roles: string[];
    userImg?: string;
    phone?: string;
    uId?:string;
    position?: string;
    workAddress?: string;
    aboutMe?: string;
    nameSystem?: string;
    qrCode: string;
    userId: string;
    isActive: boolean;
    _doc: any;

    isValidPassword: (password: string) => Promise<Error | boolean>;
}