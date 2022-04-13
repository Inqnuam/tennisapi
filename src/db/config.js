import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import dotenv from "dotenv"

dotenv.config()
let fakeDB
const Id = mongoose.Types.ObjectId
const DB_READY_MSG = "💿 MongoDB is ready!"

const connectToMongoDB = () => {
    return new Promise(async (resolve, reject) => {
        let URI = process.env.MONGO_URI
        if (process.env.TEST) {
            fakeDB = await MongoMemoryServer.create()
            URI = fakeDB.getUri()
        }

        mongoose.connect(URI, (err) => {
            if (err) reject(err)
            else resolve(DB_READY_MSG)
        })
    })
}

const disconnectFromMongoDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connection
            .close()
            .then(async () => {
                if (process.env.TEST) {
                    await fakeDB.stop({ doCleanup: true })
                }
                resolve()
            })
            .catch((err) => reject(err))
    })
}

const gracefulExit = () => {
    disconnectFromMongoDB()
        .then(() => {
            //if (!process.env.TEST)
            process.exit(0)
        })
        .catch((err) => {
            console.log(err)
            //if (!process.env.TEST)
            process.exit(1)
        })
}
export { mongoose, Id, connectToMongoDB, disconnectFromMongoDB, gracefulExit }
