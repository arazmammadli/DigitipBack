import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import AuthService, { IRegisterResponse } from "@/services/auth.service";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/utils/validations/user.validation";
import sendEmail from "@/utils/send.email";
import crypto from "crypto";

class AuthController implements Controller {
    public path = "/auth";
    public router = Router();
    private AuthService = new AuthService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/check`, validationMiddleware(validate.authCheck), this.authCheck);
        this.router.post(`${this.path}/signup`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/forgotpassword`, validationMiddleware(validate.forgotPassword), this.forgotPassword);
        this.router.post(`${this.path}/resetpassword/:resetToken`, validationMiddleware(validate.resetPassowrd), this.resetPassword);
        this.router.post(`${this.path}/adminlogin`, validationMiddleware(validate.login), this.adminLogin);
    }

    private authCheck = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email } = req.body;

            const user = await this.AuthService.authCheck(email);

            if (user) {
                res.status(302).json({ success: true });
            } else {
                res.status(302).json({ success: false });
            }
        } catch (error: any) {
            next(new HttpException(401, error.message))
        }
    }

    private register = async (
        req: Request, res: Response, next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password, repeatPassword } = req.body;
            if (password === repeatPassword) {
                const { accessToken, statusCode } = await this.AuthService.register(
                    name,
                    email,
                    password
                ) as IRegisterResponse;

                if (accessToken) {
                    // await sendEmail({
                    //     emailFrom: process.env.EMAIL_USERNAME || "",
                    //     emailTo: email,
                    //     subject: "Digitip registration!",
                    //     message: "Your Digitip registration has been successfully completed!"
                    // })

                    res
                        .status(201)
                        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                        .json({ token: accessToken, "success": true });
                } else {
                    return res.status(statusCode as number).json({ message: "This email is already registered" })
                }

            } else {
                res.status(404).json({ error: "Please fill in the fields correctly" });
            }

        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { password, email } = req.body;

            const token = await this.AuthService.login(email, password);
            if (token === "false") {
                return res.status(403).json({ message: "Your account has been disabled by admin." });
            } else {
                return res
                    .status(200)
                    .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 })
                    .json({ token, "success": true })
            }

        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private adminLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { password, email } = req.body;

            const token = await this.AuthService.adminLogin(email, password);
            res
                .status(200)
                .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 })
                .json({ token, "success": true });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const cookies = req.cookies;
            if (!cookies.accessToken) throw new Error("No content"); // No content
            const cookiesArr = ['accessToken',"connect.sid"];
            for(let cookie of cookiesArr) {
                res.clearCookie(cookie);
            };
            req.session.destroy((err) => {
                if(!err) res.status(200);
            });
            req.logout((err) => {
                res.json({ message: "Log out successed." });
            });
        } catch (error: any) {
            next(new HttpException(204, error.message));
        }
    }

    private forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { email } = req.body;
        const forgotData = await this.AuthService.forgotPassword(email, res);

        // Reset email
        const message = {
            message: `
            <h2>Hello ${forgotData?.user.name}</h2>
            <p>Please use the url below to reset your password</p>  
            <p>This reset link is valid for only 30minutes.</p>
            <a href=${forgotData?.resetUrl} clicktracking=off>${forgotData?.resetUrl}</a>
            <p>Regards...</p>
            <p>Pinvent Team</p>
          `,
            subject: "Password Reset Request",
            emailTo: email,
            emailFrom: process.env.EMAIL_USERNAME || ""
        };
        try {
            await sendEmail(message);
            res
                .status(200)
                .json({ success: true, message: "Reset Email Send" })
        } catch (error: any) {
            next(new HttpException(500, error.message))
        }
    }

    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { password, verifyPassword } = req.body;
            const { resetToken } = req.params;
            if (password === verifyPassword) {
                const result = await this.AuthService.resetPassword(password, resetToken);
                res
                    .status(200)
                    .json({
                        email: result,
                        message: "Password Reset Successful, Please Login",
                    });
            } else {
                res.status(400).json({ error: "Please fill in the fields correctly" });
            }
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }

    }
};

export default AuthController;