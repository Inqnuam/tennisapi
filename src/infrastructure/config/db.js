import { connectToMongoDB } from "../persistence/mongoose/config.js";
import { connectToSQL } from "../persistence/sequelize/config.js";

const isTesting = process.argv.includes("--isTesting");
let mongoose;
let fakeMongoDB;
let sequelize;

const connectToDB = async (isSQL) => {
    if (isSQL) {
        sequelize = await connectToSQL();
    } else {
        mongoose = await connectToMongoDB();
    }
};

const disconnectFromDB = async () => {
    if (sequelize) {
        if (isTesting) {
            await sequelize.sync({ force: true, alter: true });
        }
        await sequelize.close();
    }

    if (mongoose) {
        await mongoose.connection.close();
        if (isTesting) {
            await fakeMongoDB.stop({ doCleanup: true });
        }
    }
};

const gracefulExit = () => {
    disconnectFromDB()
        .then(() => {
            if (!isTesting) process.exit(0);
        })
        .catch((err) => {
            if (!isTesting) process.exit(1);
        });
};

export { mongoose, connectToDB, disconnectFromDB, gracefulExit, sequelize };
