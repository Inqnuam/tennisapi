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
const isSQL = process.env.DB_TYPE !== "mongodb";

describe("Check API connections and results", () => {
    before(async () => {
        const { app } = await import("../server.js");

        if (isSQL) {
            const { sequelize } = await import("../server.js");
            await sequelize.sync({ force: true, alter: true });
        }

        server = app;
    });

    after(async () => {
        await disconnectFromDB();
    });

    describe("POST new player", () => {
        it("must insert a new player to the DB and return new player", (done) => {
            let player = players[0];
            player.birthday = Date.now();
            chai.request(server)
                .post("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.id.should.be.a("number", player.id);
                    done();
                });
        });

        it("inserts a second player to the DB and return new player", (done) => {
            let player = players[1];
            player.birthday = Date.now();
            chai.request(server)
                .post("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("must fail to create a new player with an exising player id", (done) => {
            let player = players[0];
            player.birthday = Date.now();
            chai.request(server)
                .post("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    done();
                });
        });
    });

    describe("PATCH update player", () => {
        it("updates player and return updated player", (done) => {
            let player = players[1];
            player.firstname = "Andre";
            player.lastname = "Agassi";
            chai.request(server)
                .patch("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.shortname.should.be.a("string", "A.AGA");

                    done();
                });
        });

        it("must fail to update a player with incorrect value", (done) => {
            let player = players[1];
            player.birthday = "hello world";
            chai.request(server)
                .patch("/v1/player")
                .set("api-key", key)
                .set("content-type", "application/json")
                .send(player)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe("DELETE player by id", () => {
        it("must return deleted player id ", (done) => {
            const deletingPlayerId = players[1].id;
            chai.request(server)
                .delete(`/v1/player/${deletingPlayerId}`)
                .set("api-key", key)
                .set("content-type", "application/json")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.deleted.should.be.a("number", deletingPlayerId);

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
            const player = players[0];
            chai.request(server)
                .get(`/v1/player/${player.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.fullname.should.be.a("string", `${player.firstname} ${player.lastname}`);
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
