import { Schema, model } from "mongoose";
import User from "@/utils/interfaces/user.interface";
import bcrypt from "bcrypt";
import QRCode from "qrcode";
import generatePin from "@/utils/userPinGenerete";

const userSchema = new Schema(
    {
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
    },
    { timestamps: true }
);

userSchema.pre<User>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    const qrcode = await QRCode.toDataURL(this.name, { width: 295, type: "image/png", errorCorrectionLevel: "H" });
    const uniqId = generatePin(-9);
    this.password = hash;
    this.qrCode = qrcode;
    this.userId = uniqId;
    next();
});

userSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<User>("User", userSchema);

