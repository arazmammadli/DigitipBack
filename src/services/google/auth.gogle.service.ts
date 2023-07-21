// import { OAuth2Client } from "google-auth-library"
// import UserModel from "@/model/user.model";
// import token from "@/utils/token";

// class GoogleService {
//     private client = new OAuth2Client(process.env.GOOGLE_CLIENTID);
//     private user = UserModel;

//     public async googleLogin(
//         tokenId: string
//     ) {
//         try {
//             const verify = await this.client.verifyIdToken({
//                 idToken: tokenId,
//                 audience: process.env.GOOGLE_CLIENTID
//             })

//             const payload = verify.getPayload();

//             const password = payload?.email || "" + process.env.GOOGLE_PWD_SECRET;

//             const newUser = {
//                 name: payload?.given_name,
//                 email: payload?.email,
//                 password: password,
//                 userImg: payload?.picture
//             }

//             if (!payload?.email_verified) throw new Error("Email verification failed.");

//             const user = await this.user.findOne({ email: payload.email }).exec();

//             if (user) {
//                 if (await user.isValidPassword(password)) {
//                     const accessToken = token.createToken(user);
//                     return accessToken;
//                 }
//             } else {
//                 const createUser = await this.user.create(newUser);
//                 const accessToken = token.createToken(createUser);
//                 return accessToken;
//             }

//         } catch (error) {
//             throw new Error("Internal server error")
//         }
//     }

// };

// export default GoogleService;


import { PassportStatic } from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "@/model/user.model";
import token from "@/utils/token";

export const googleAuth = (passport: PassportStatic) => {
    passport.use(new GoogleStrategy(
        {
            clientID: `${process.env.GOOGLE_CLIENTID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
            callbackURL: `${process.env.GOOGLE_OAUTH_REDIRECT_URI}`
        },
        async function (_: any, __: any, profile: Profile, cb: any) {

            const user = await UserModel.findOne({ uId: profile.id }).exec();
            if (!user) {
                // create new user
                const password = profile.emails ? profile.emails[0].value + process.env.GOOGLE_PWD_SECRET : "";

                const newUser = await UserModel.create({
                    uId: profile.id,
                    name: profile.name?.givenName,
                    surname: profile.name?.familyName,
                    email: profile.emails ? profile.emails[0].value : "",
                    userImg: profile.photos ? profile.photos[0].value : "",
                    password: password
                });

                const accessToken = token.createToken(newUser);

                return cb(null, newUser, { message: "Auth successful", accessToken: accessToken });
            } else {
                const accessToken = token.createToken(user);
                return cb(null, user, { message: "Auth successful", accessToken: accessToken });
            };

        }
    )
    );
    passport.serializeUser((user: any, done: any) => {
        return done(null, user._id);
    });
    passport.deserializeUser(async (id: string, done: any) => {
        const user = await UserModel.findById(id);
        done(null, user);
    })
};