import { players } from "../resources/headtohead.js";
import { disconnectFromDB } from "../src/db/config.js";
import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";
dotenv.config();

chai.use(chaiHttp);
chai.should();

let server;
const key = process.env.API_KEY;

const birthday = Date.now();
let firstPlayer = players[0];
firstPlayer.birthday = birthday;

let secondPlayer = players[1];
secondPlayer.birthday = birthday;

let newPlayer = players[2];
newPlayer.birthday = Date.now();

let playerToDelete = players[3];
playerToDelete.birthday = birthday;

describe("Check API connections and results", () => {
    before(async () => {
        const { app } = await import("../server.js");
        server = app;

        // To be replaced with a multiple insert endpoint
        const firstInsertedPlayerRespose = await chai.request(server).post("/v1/player").set("api-key", key).set("content-type", "application/json").send(firstPlayer);
        firstInsertedPlayerRespose.should.have.status(200);
        firstInsertedPlayerRespose.body.should.be.a("object");
        firstInsertedPlayerRespose.body.id.should.be.a("number", firstPlayer.id);

        const secondeInsertedPlayerRespose = await chai.request(server).post("/v1/player").set("api-key", key).set("content-type", "application/json").send(secondPlayer);
        secondeInsertedPlayerRespose.should.have.status(200);
        secondeInsertedPlayerRespose.body.should.be.a("object");
        secondeInsertedPlayerRespose.body.id.should.be.a("number", secondPlayer.id);

        const playerToDeleteRespose = await chai.request(server).post("/v1/player").set("api-key", key).set("content-type", "application/json").send(playerToDelete);
        playerToDeleteRespose.should.have.status(200);
        playerToDeleteRespose.body.should.be.a("object");
        playerToDeleteRespose.body.id.should.be.a("number", playerToDelete.id);
    });

    after(async () => {
        await disconnectFromDB();
    });

    describe("POST new player", () => {
        it("must insert a new player to the DB and return new player", (done) => {
            chai.request(server)
                .post("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(newPlayer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("must fail to create a new player with an exising player id", (done) => {
            chai.request(server)
                .post("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(firstPlayer)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    done();
                });
        });
    });

    describe("PATCH update player", () => {
        it("updates player and return updated player", (done) => {
            firstPlayer.firstname = "Andre";
            firstPlayer.lastname = "Agassi";
            chai.request(server)
                .patch("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(firstPlayer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.shortname.should.be.a("string", "A.AGA");

                    done();
                });
        });

        it("updates player last games", (done) => {
            let player = {
                id: firstPlayer.id,
                data: {
                    last: [0, 0, 0],
                },
            };
            chai.request(server)
                .patch("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("Check database persistence", (done) => {
            chai.request(server)
                .get(`/v1/player/${firstPlayer.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.last.should.be.a("array", [0, 0, 0]);
                    done();
                });
        });

        it("must fail to update a player with incorrect value", (done) => {
            secondPlayer.birthday = "hello world";
            chai.request(server)
                .patch("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(secondPlayer)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe("DELETE player by id", () => {
        it("must return deleted player id ", (done) => {
            chai.request(server)
                .delete(`/v1/player/${playerToDelete.id}`)
                .set("api-key", key)
                .set("content-type", "application/json")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.deleted.should.be.a("number", playerToDelete.id);
                    done();
                });
        });
    });

    describe("GET all players", () => {
        it("must return an array of players", (done) => {
            chai.request(server)
                .get("/v1/players")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    describe("GET player by id", () => {
        it("returns player object", (done) => {
            chai.request(server)
                .get(`/v1/player/${secondPlayer.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.fullname.should.be.a("string", `${secondPlayer.firstname} ${secondPlayer.lastname}`);
                    done();
                });
        });

        it("must fail to find a player with wrong id", (done) => {
            chai.request(server)
                .get("/v1/player/wrongId")
                .end((err, res) => {
                    res.should.not.have.status(200);
                    done();
                });
        });
    });
});
