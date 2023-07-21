import { Schema } from "mongoose";

interface Token extends Schema {
    id: Schema.Types.ObjectId;
    expiresIn: number
};

export default Token;