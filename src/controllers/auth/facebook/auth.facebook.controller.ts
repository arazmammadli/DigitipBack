import Controller from '@/utils/interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import HttpException from '@/utils/exceptions/http.exception';
import passport from 'passport';
import User from '@/utils/interfaces/user.interface';

class FbController implements Controller {
    public path = '/auth/facebook';
    public router = Router();

    constructor() {
        this.initialiseRoutes();
    }

    initialiseRoutes(): void {
        this.router.get(
            `${this.path}`,
            passport.authenticate('facebook', { scope: ['profile', 'email'] })
        );

        this.router.get(
            `${this.path}/callback`,
            (req: Request, res: Response, next: NextFunction) => {
                passport.authenticate(
                    'facebook',
                    {
                        failureRedirect:
                            process.env.FACEBOOK_AUTH_FAILURE_REDIRECT,
                    },
                    (
                        err: unknown,
                        user: User,
                        info: { accessToken: string }
                    ) => {
                        if (err || !user) {
                            return res.redirect(
                                process.env
                                    .FACEBOOK_AUTH_FAILURE_REDIRECT as string
                            );
                        }

                        const { accessToken } = info;
                        return res
                            .cookie('accessToken', accessToken, {
                                maxAge: 1000 * 60 * 60,
                            })
                            .redirect(
                                process.env
                                    .FACEBOOK_AUTH_SUCCESS_REDIRECT as string
                            );
                    }
                )(req, res, next);
            }
        );
    }
}

export default FbController;
