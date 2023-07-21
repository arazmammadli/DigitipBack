import UserModel from "@/model/user.model";
import Token from "@/model/token.models";
import { NextFunction, Request, Response } from "express";
import token from "@/utils/token";
import crypto from "crypto";

export interface IRegisterResponse {
    accessToken?: string;
    statusCode?: number;
}

class AuthService {
    private user = UserModel;
    private token = Token;

    public async authCheck(
        email: string
    ) {
        try {
            const user = await this.user.findOne({ email: email }).exec();
            return user;
        } catch (error: any) {
            throw new Error("Unable to find user with that email address");
        }
    }

    public async register(
        name: string,
        email: string,
        password: string,
    ): Promise<IRegisterResponse | Error> {
        try {
            const currentUser = await this.user.findOne({ email }).exec();
            let statusCode: number;
            if (!currentUser) {
                const user = await this.user.create({
                    name,
                    email,
                    password,
                });
                const accessToken = token.createToken(user);
                return { accessToken };
            } else {
                statusCode = 409;
                return { statusCode }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            if (!email || !password) {
                throw new Error("Please enter email & password")
            }
            const user = await this.user.findOne({ email }).exec();
            if (!user) {
                throw new Error("Unable to find user with that email address");
            }

            if (await user.isValidPassword(password) && user.isActive === true) {
                return token.createToken(user);
            } else if (user.isActive === false) {
                return "false"
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }

    public async adminLogin(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            if (!email || !password) {
                throw new Error("Please enter email & password");
            }
            const user = await this.user.findOne({ email }).exec();
            if (!user) {
                throw new Error("Unable to find user with that email address");
            }
            if (await user.isValidPassword(password) && user.roles.includes("Admin")) {
                return token.createToken(user);
            } else {
                throw new Error("Wrong credentials given");
            }

        } catch (error) {
            throw new Error("Unable to create user");
        }
    }

    public async forgotPassword(
        email: string,
        res: Response
    ) {
        try {
            const user = await this.user.findOne({ email }).exec();

            if (!user) {
                res.status(404);
                throw new Error("User does not exist");
            }

            let currentToken = await this.token.findOne({ userId: user._id }).exec();
            if (currentToken) {
                await this.token.deleteOne();
            }

            // Create Reset Token
            let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

            const hashedToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex")

            // Save Token to DB
            await new Token({
                userId: user._id,
                token: hashedToken,
                createdAt: Date.now(),
                expiresAt: Date.now() + 30 * (60 * 1000)
            }).save();

            // Construct Reset Url
            const resetUrl = `${process.env.FRONTEND_URL}/reset/password/${resetToken}`;

            return { user, resetUrl };
        } catch (error) {
            new Error("Email not sent, please try again");
        }
    }

    public async resetPassword(
        password: string,
        resetToken: string,
    ) {
        try {
            const hashedToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

            // finf token in DB
            const userToken = await this.token.findOne({
                token: hashedToken,
                expiresAt: { $gt: Date.now() },
            }).exec();

            if (!userToken) {
                throw new Error("Invalid or Expired Token");
            }

            // Find user
            const user = await this.user.findOne({ _id: userToken.userId });
            if (user) {
                user.password = password;
                await user.save();
                return user.email;
            }
        } catch (error) {
            throw new Error("an error occured")
        }
    }
};

export default AuthService;
