import PartnerModel from "@/model/partners.model";
import IPartner from "@/utils/interfaces/partners.interface";
import cloudinary from "cloudinary";

export interface IPartnerResponse {
    newPartner?: IPartner;
    statusCode?: number;
}

class PartnerService {
    private partner = PartnerModel;

    public async createPartner(
        file: string,
        partnerImgName:string
    ) {
        if(!partnerImgName) {
            throw new Error("Partner img name required.");
        } 
        const partner = await this.partner.findOne({ partnerImg: file }).exec();
        let statusCode: number;
        if (!partner) {
            const result = await cloudinary.v2.uploader.upload(file, {
                folder: "partners"
            });

            const newPartner = await this.partner.create({
                partnerImg: result.secure_url,
                partnerImgName:partnerImgName
            });

            return newPartner;
        } else {
            statusCode = 409;
            throw new Error("The same image cannot be added twice")
        }
    }

    public async getAllPartners() {
        const partners = await this.partner.find({});
        if(!partners) {
            throw new Error("No partners found.");
        }
        return partners;
    }

    public async getPartner(
        partnerId:string
    ) {
        try {
            if(!partnerId) {
                throw new Error("Partner Id required");
            }

            const partner = await this.partner.findOne({_id:partnerId}).exec();
            if(partner) {
                return partner
            }
        } catch (error) {
            throw new Error("Partner Not Found");
            
        }
    }

    public async deletePartner(
        partnerId: string
    ) {
        if (!partnerId) {
            throw new Error("Partner ID required");
        }

        const partner = await this.partner.findOne({ _id: partnerId }).exec();
        if (!partner) {
            throw new Error(`No partner matches ID ${partnerId}`);
        }
        const result = await partner.deleteOne({ _id: partnerId });
        return result;
    }

    public async updatePartner(
        id:string,
        file:string,
        partnerImgName:string
    ){
        if(!partnerImgName) {
            throw new Error("Partner img name required!");
        }
        const partner = await this.partner.findById(id);

        if(partner) {
            let result;
            if(file && file !== partner.partnerImg) {
                result = await cloudinary.v2.uploader.upload(file,{
                    folder:"partners",
                });
            };
            partner.partnerImg = file !== partner.partnerImg ? result?.secure_url as string : partner.partnerImg;
            partner.partnerImgName = file !== partner.partnerImg ? partnerImgName : partner.partnerImgName
            const updatePartner = await partner.save();
            return updatePartner;
        } else {
            throw new Error("Partner not found");
        }
    }
};

export default PartnerService;