import jwt from "jsonwebtoken";
import User from "./interfaces/user.interface";
import Token from "./interfaces/token.interface";

export const createToken = (user: User): string => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: "60m" })
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as Token);
            }
        )
    })
}

export default { createToken, verifyToken };