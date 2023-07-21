import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Controller from "@/utils/interfaces/controller.interface";
import fileUpload from "express-fileupload";
import ErrorMiddleware from "@/middleware/error.middleware";
import session from "express-session";
import passport from "passport";
import { corsOptions } from "./config/cors.options";
import { googleAuth } from "@/services/google/auth.gogle.service";
import { facebookAuth } from "@/services/facebook/auth.facebook.service";

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseCloudinaryConfig();
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialisePassword();
        this.initialiseErrorHandling();
    }

    private initialiseCloudinaryConfig(): void {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    private initialiseMiddleware(): void {
        this.express.use(cors(corsOptions));
        this.express.use(express.json({ limit: "50mb" }));
        this.express.use(cookieParser());
        this.express.use(
            session({
                secret: "secretcode",
                resave: false,
                saveUninitialized: true,
                cookie: {
                    maxAge: 1000 * 60 * 60
                }
            })
        )
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(fileUpload());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use("/api", controller.router)
        })
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private async initialiseDatabaseConnection(): Promise<void> {
        const DATABASE_URI = process.env?.DATABASE_URI || "";
        try {
            await mongoose.connect(DATABASE_URI);
        } catch (error) {
            console.error(error);
        }
    }

    private initialisePassword(): void {
        googleAuth(passport);
        facebookAuth(passport);

    }

    public listen(): void {
        mongoose.connection.once("open", () => {
            console.log("Connected to Mongo DB.");
            this.express.listen(this.port, () => {
                console.log(`server running on ${this.port} port.`)
            })
        })
    }
};

export default App;