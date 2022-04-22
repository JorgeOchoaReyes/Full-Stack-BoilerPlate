"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const typeorm_config_1 = require("./util/typeorm-config");
const user_1 = require("./Resolvers/user");
const main = async () => {
    let connection = await typeorm_config_1.mydataSource.initialize();
    connection.runMigrations();
    const app = (0, express_1.default)();
    app.set('trust proxy', process.env.NODE_ENV !== 'production');
    let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    let redisClient = new ioredis_1.default();
    app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
    redisClient.on('error', function (err) {
        console.log('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', function () {
        console.log('Connected to redis successfully');
    });
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redisClient
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: false,
            sameSite: "lax",
            secure: false,
        },
        resave: false,
        secret: 'aaaaaaaaaaaaaa',
        saveUninitialized: false
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver],
            validate: false
        }),
        plugins: [
            process.env.NODE_ENV === 'production'
                ? (0, apollo_server_core_1.ApolloServerPluginLandingPageDisabled)()
                : (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
        ],
        context: ({ req, res }) => ({ req, res, redisClient })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map