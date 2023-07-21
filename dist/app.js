"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const error_middleware_1 = __importDefault(require("@/middleware/error.middleware"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_options_1 = require("./config/cors.options");
const auth_gogle_service_1 = require("@/services/google/auth.gogle.service");
const auth_facebook_service_1 = require("@/services/facebook/auth.facebook.service");
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initialiseCloudinaryConfig();
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialisePassword();
        this.initialiseErrorHandling();
    }
    initialiseCloudinaryConfig() {
        cloudinary_1.default.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    initialiseMiddleware() {
        this.express.use((0, cors_1.default)(cors_options_1.corsOptions));
        this.express.use(express_1.default.json({ limit: "50mb" }));
        this.express.use((0, cookie_parser_1.default)());
        this.express.use((0, express_session_1.default)({
            secret: "secretcode",
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 60 * 60
            }
        }));
        this.express.use(passport_1.default.initialize());
        this.express.use(passport_1.default.session());
        this.express.use((0, express_fileupload_1.default)());
        this.express.use(express_1.default.urlencoded({ extended: false }));
    }
    initialiseControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api", controller.router);
        });
    }
    initialiseErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    initialiseDatabaseConnection() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const DATABASE_URI = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.DATABASE_URI) || "";
            try {
                yield mongoose_1.default.connect(DATABASE_URI);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    initialisePassword() {
        (0, auth_gogle_service_1.googleAuth)(passport_1.default);
        (0, auth_facebook_service_1.facebookAuth)(passport_1.default);
    }
    listen() {
        mongoose_1.default.connection.once("open", () => {
            console.log("Connected to Mongo DB.");
            this.express.listen(this.port, () => {
                console.log(`server running on ${this.port} port.`);
            });
        });
    }
}
;
exports.default = App;
