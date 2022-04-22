import { DataSource } from "typeorm";
import path from 'path'; 
import { User } from "../entities/User";

const database = "Example";
const username = "postgres";
const password = "polly1111" as string;

export let mydataSource = new DataSource({
    type: "postgres",
    database: database,
    username:  username,
    password: password, 
    logging: true, 
    synchronize: true, 
    entities: [User],
    migrations: [path.join(__dirname, "./migrations/*")],
}); 
