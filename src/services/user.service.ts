import UserModel from "@/model/user.model";
import cloudinary from "cloudinary";

class UserService {
    private user = UserModel;

    public async getShowMe(
        userId: string
    ) {
        try {
            const user = await this.user.findOne({ _id: userId }).exec();
            if (user) {
                return user;
            }
        } catch (error) {
            throw new Error("User Not Found");
        }
    }

    public async getUser(
        userId: string
    ) {
        try {
            if (!userId) {
                throw new Error("User ID required");
            }
            const user = await this.user.findOne({ _id: userId }).exec();
            if (user) {
                return user;
            }
        } catch (error) {
            throw new Error("User Not Found");
        }
    }

    public async getAllUser() {
        const users = await this.user.find({});
        if (!users) {
            throw new Error("No users found.");
        }
        return users;
    }

    public async deleteUser(
        userId: string
    ) {
        if (!userId) {
            throw new Error("User ID required");
        }

        const user = await this.user.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error(`User ID ${userId} not found.`)
        }

        const result = await user.deleteOne({ _id: userId });
        return result;
    }

    public async deactiveUser(
        userId: string,
        status: number
    ) {
        if (!userId) {
            throw new Error("user ID and status required");
        }
        const user = await this.user.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error(`User ID ${userId} not found`);
        }
        user.isActive = status === 0 ? true : false;
        const updateUser = await user.save();
        return updateUser;
    }

    public async editUser(
        name: string,
        surname: string,
        file: string,
        position: string,
        phone: string,
        nameSystem: string,
        workAddress: string,
        aboutMe: string,
        id: string
    ) {
        const user = await this.user.findById(id);
        if (user) {
            let result;
            if (file && file !== user.userImg) {
                result = await cloudinary.v2.uploader.upload(file, {
                    folder: "images",
                })
            }

            user.name = name;
            user.userImg = file !== user.userImg ? result?.secure_url : user.userImg;
            user.surname = surname;
            user.position = position;
            user.phone = phone;
            user.nameSystem = nameSystem;
            user.workAddress = workAddress;
            user.aboutMe = aboutMe;


            const updateUser = await user.save();
            return updateUser;
        } else {
            throw new Error("User not found");
        }
    }
};

export default UserService;