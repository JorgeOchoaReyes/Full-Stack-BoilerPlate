"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mydataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const User_1 = require("../entities/User");
const database = "Example";
const username = "postgres";
const password = "polly1111";
exports.mydataSource = new typeorm_1.DataSource({
    type: "postgres",
    database: database,
    username: username,
    password: password,
    logging: true,
    synchronize: true,
    entities: [User_1.User],
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
});
//# sourceMappingURL=typeorm-config.js.map