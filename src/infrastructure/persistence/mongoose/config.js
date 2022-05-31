import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";

dotenv.config();

const isTesting = process.argv.includes("--isTesting");
let fakeMongoDB;

export const connectToMongoDB = async () => {
    let URI = process.env.MONGO_URI;

    if (isTesting) {
        fakeMongoDB = await MongoMemoryServer.create();
        URI = fakeMongoDB.getUri();
    }

    await mongoose.connect(URI);
    return mongoose;
};
