import Controller from "@/utils/interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express"
import HttpException from "@/utils/exceptions/http.exception";
import authenticated from "@/middleware/authenticated.middleware";
import PartnerService, { IPartnerResponse } from "@/services/partner.service";

class PartnerController implements Controller {
    public path = "/partners";
    public router = Router();
    private PartnerService = new PartnerService();

    constructor() {
        this.initialiseRoutes();
    }

    initialiseRoutes(): void {
        this.router.route(`${this.path}`)
            .get(authenticated, this.getAllPartners)
            .post(authenticated, this.createPartner)
            .delete(authenticated, this.deletePartner)
            .put(authenticated, this.updatePartner);

        this.router.get(`${this.path}/:partnerId`, authenticated, this.getPartner);
    }

    private createPartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { partnerImg, partnerImgName } = req.body;
            const result = await this.PartnerService.createPartner(partnerImg, partnerImgName) as IPartnerResponse;
            if (result.statusCode === undefined) {
                return res
                    .status(201)
                    .json({ message: "Partner created successful.", success: true });
            } else {
                return res.status(result.statusCode as number).json({ message: "This partner image is already created" })
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getAllPartners = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const partners = await this.PartnerService.getAllPartners();

            res
                .status(200)
                .json(partners);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getPartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { partnerId } = req.params;
            const partner = await this.PartnerService.getPartner(partnerId);

            res
                .status(200)
                .json(partner)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private deletePartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { partnerId } = req.body;
            const result = await this.PartnerService.deletePartner(partnerId);

            res
                .status(200)
                .json({ message: "Partner deleted succesful", ...result });

        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private updatePartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id, file, partnerImgName } = req.body;
            const updatePartner = await this.PartnerService.updatePartner(id, file, partnerImgName);

            res
                .status(200)
                .json({ message: "Partner update successful", ...updatePartner });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
};

export default PartnerController;