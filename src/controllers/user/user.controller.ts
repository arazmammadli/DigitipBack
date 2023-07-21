import Controller from "@/utils/interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import UserService from "@/services/user.service";
import HttpException from "@/utils/exceptions/http.exception";
import authenticated from "@/middleware/authenticated.middleware";
import verifyRoles from "@/middleware/verify.roles";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, authenticated, this.getAllUser);
        this.router.get("/user/me", authenticated, this.getShowMe);
        this.router.get(`${this.path}/:userId`, authenticated, verifyRoles("Admin"), this.getUser);
        this.router.delete(`${this.path}`, authenticated, verifyRoles("Admin"), this.deleteUser);
        this.router.put(`${this.path}/change-status`, authenticated, this.deactiveUser);
        this.router.put("/user/me", authenticated, this.editUser);
    }

    private getShowMe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(404, 'No logged in user'));
            }
            const { _id: userId } = req.user;
            const user = await this.UserService.getShowMe(userId);

            const { password, ...userData } = user?._doc
            res
                .status(200)
                .json({ ...userData });

        } catch (error: any) {
            next(new HttpException(400, error.mesage));
        }
    }

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId } = req.params;
            const user = await this.UserService.getUser(userId);
            res
                .status(200)
                .json(user);
        } catch (error) {
            next(new HttpException(400, "User Not Found"));
        }
    }

    private getAllUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await this.UserService.getAllUser();
            res
                .status(200)
                .json(users)
        } catch (error: any) {
            next(new HttpException(204, error.message))
        }
    }

    private deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId } = req.body;

            const result = await this.UserService.deleteUser(userId);
            res
                .status(200)
                .json(result);
        } catch (error: any) {
            next(new HttpException(500, error.message))
        }
    }

    private deactiveUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, status } = req.body;
            console.log(userId)
            const result = await this.UserService.deactiveUser(userId, status);
            if (result) {
                res
                    .status(200)
                    .json({ message: "Successful.", ...result });
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private editUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, surname, file, position, phone, nameSystem, workAddress, aboutMe, id } = req.body;
            const updateUser = await this.UserService.editUser(
                name,
                surname,
                file,
                position,
                phone,
                nameSystem,
                workAddress,
                aboutMe,
                id
            );

            res
                .status(200)
                .json(updateUser);
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    }
};

export default UserController;