import { PassportStatic } from "passport";
import { Profile, Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "@/model/user.model";
import token from "@/utils/token";

export const facebookAuth = (passport: PassportStatic) => {
    passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_APP_SECRET || "",
            callbackURL: process.env.FACEBOOK_OAUTH_REDIRECT_URI || ""
        },
        async function (_: any, __: any, profile: Profile, cb: any) {
            const user = await UserModel.findOne({ uId: profile.id }).exec();

            if (!user) {
                // create new user
                const password = profile.emails ? profile.emails[0].value + process.env.FACEBOOK_APP_SECRET : "";

                const newUser = await UserModel.create(
                    {
                        uId: profile.id,
                        name: profile.name?.givenName,
                        surname: profile.name?.familyName,
                        email: profile.emails ? profile.emails[0].value : "",
                        userImg: profile.photos ? profile.photos[0].value : "",
                        password: password
                    }
                );

                const accessToken = token.createToken(newUser);
                return cb(null, newUser, { message: "Facebook auth successful", accessToken: accessToken });
            } else {
                const accessToken = token.createToken(user);
                return cb(null, user, { message: "Facebook auth successful", accessToken: accessToken })
            }
        }
    )
    );
    passport.serializeUser((user: any, done: any) => {
        return done(null, user._id);
    });
    passport.deserializeUser(async (id: string, done: any) => {
        const user = await UserModel.findById(id);
        done(null, user);
    });
};