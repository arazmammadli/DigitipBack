// import Controller from "@/utils/interfaces/controller.interface";
// import { NextFunction, Request, Response, Router } from "express";
// import passport from "passport";
// import GoogleService from "@/services/google/auth.gogle.service";
// import HttpException from "@/utils/exceptions/http.exception";

// class GoogleAuthController implements Controller {
//     public path = "/auth/google";
//     public router = Router();
//     private GoogleAuthService = new GoogleService();

//     constructor() {
//         this.initialiseRoutes();
//     }

//     private initialiseRoutes(): void {
//         this.router.post(`${this.path}`, this.googleLogin);
//         this.router.get(`${this.path}/callback`, (req: Request, res: Response, next: NextFunction) => {
//             passport.authenticate("google", {
//                 failureRedirect: process.env.GOOGLE_AUTH_FAILURE_REDIRECT
//             }, (err, user, info) => {
//                 if (err || !user) {
//                     return res.redirect(process.env.GOOGLE_AUTH_FAILURE_REDIRECT as string);
//                 }
//                 res
//                     .status(200)
//                     .cookie("accessToken", info.accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
//                     .redirect(process.env.GOOGLE_AUTH_SUCCESS_REDIRECT as string)
//             })(req, res, next);
//         }
//         );
//     }

//     private googleLogin = async (
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ): Promise<Response | void> => {
//         try {
//             const { tokenId } = req.body;
//             const token = await this.GoogleAuthService.googleLogin(tokenId);

//             res
//                 .status(200)
//                 .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 })
//                 .json({ token, "success": true });

//         } catch (error:any) {
//             next(new HttpException(400,error.message))
//         }
//     }

// };

// export default GoogleAuthController;

import Controller from "@/utils/interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

class GoogleAuthController implements Controller {
    public path = "/auth/google";
    public router = Router();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, passport.authenticate("google", { scope: ["profile", "email"] }));

        this.router.get(`${this.path}/callback`, (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate("google", {
                failureRedirect: process.env.GOOGLE_AUTH_FAILURE_REDIRECT
            }, (err, user, info) => {
                if (err || !user) {
                    return res.redirect(process.env.GOOGLE_AUTH_FAILURE_REDIRECT as string)
                }

                const { accessToken } = info;
                return res
                    .cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 })
                    .redirect(process.env.GOOGLE_AUTH_SUCCESS_REDIRECT as string)
            })(req, res, next);
        }
        );

    }
};

export default GoogleAuthController