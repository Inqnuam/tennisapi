# Introduction

REST API based on ExpressJS and MongoDB

---

## Minimum requirements

-   NodeJS with ECM support (v12.22 with --experimental-modules flag or ^14)\*
-   MongoDB/SQL DB installed locally or with remote access \*\*
-   PM2 installed globally (`npm install pm2 -g`)

° Please use recent NPM version to avoid package issues.  
°° Not required for MongoDB tests.  
Database dumps (Mongo and SQL) with initial data can be found in resources directory.

## Installation

Follow instructions in console after running the commande below.  
Helps you to set required env variables.

```bash
npm run config
```

---

## Start

```bash
npm run start
```

## Restart

```bash
npm run restart
```

after updating env variables in .env file restart the server with the commande above.  
use `npm run restart-hard` after making changes to ecosystem.config.cjs.

## Stop

```bash
npm run kill
```

## Test

```bash
npm run test
```

---

## Endpoints

### API v1

Prefix endpoint paths with `/v1`.  
Set id in url param/query or in request body for endoints requireing it.  
Requests doing CUD operations must contain `api-key` in request headers.  
All responses returning Content-Type is application/json.

| method | path           | description                                                                   | returns                                                | api_key  |
| ------ | -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| GET    | /players       | Get all players sorted from best to worst.                                    | `Array` of all players                                 |          |
| GET    | /players/stats | Get best country, players average IMC and players median size.                | `Object` with bestCountry, averageIMC, medianSize keys |          |
| GET    | /player        | Get player data by id.                                                        | `Object` with player data                              |          |
| POST   | /player        | Add new player to the database. [See Players model](./src/models/players.js). | `Object` with newly created player data                | required |
| PATCH  | /player        | Update player data by id. [See Players model](./src/models/players.js).       | `Object` with updated player data                      | required |
| DELETE | /player        | Delete player by id.                                                          | `Object` {"deleted": "deleted player id"}              | required |

You can test the API with Postman by importing the collection file from resources directory.

---

### Notes

-   All logs will be written into `logs` directory (which will be created after the first launch).
-   Logs live monitoring with `pm2 logs`.
-   Use `pm2 save` to launch the server at OS startup.
