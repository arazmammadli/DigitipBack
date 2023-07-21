import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import AuthController from '@/controllers/auth/auth.controller';
import UserController from '@/controllers/user/user.controller';
import GoogleController from '@/controllers/auth/google/auth.google.controller';
import FbController from '@/controllers/auth/facebook/auth.facebook.controller';
import PartnerController from '@/controllers/partner/partner.controller';

const app = new App(
    [
        new AuthController(),
        new UserController(),
        new GoogleController(),
        new FbController(),
        new PartnerController(),
    ],
    Number(process.env.PORT) || 3000
);

app.listen();
