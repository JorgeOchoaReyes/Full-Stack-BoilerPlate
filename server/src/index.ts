import "reflect-metadata"; 
import {COOKIE_NAME, __prod__} from "./constants";
import express from "express";
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql'; 
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors'; 
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { mydataSource } from "./util/typeorm-config";
import { UserResolver } from "./Resolvers/user";

const main = async () => {
        
    let connection = await mydataSource.initialize();

    connection.runMigrations();

    const app = express(); 

    app.set('trust proxy', process.env.NODE_ENV !== 'production'); 

    let RedisStore = connectRedis(session); 
    let redisClient = new Redis(); 

    app.use(cors({origin: 'http://localhost:3000', credentials: true}));
 
    
    redisClient.on('error', function (err) {
        console.log('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', function () {
        console.log('Connected to redis successfully');
    });
  
    app.use(
        session({
            name: COOKIE_NAME, 
            store: new RedisStore(
                { 
                    client: redisClient
            }),
            cookie: {
                maxAge: 1000* 60 * 60* 24* 365 * 10,
                httpOnly: false, 
                sameSite: "lax", 
                secure: false,                 
            },
            resave: false,
            secret: 'aaaaaaaaaaaaaa', 
            saveUninitialized: false
        })     
    );
 
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false
        }),
        plugins: [
            process.env.NODE_ENV === 'production'
              ? ApolloServerPluginLandingPageDisabled()
              : ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
        context: ({req, res})=>({req , res, redisClient}) 
    }) 

    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false}); 

    app.listen(4000, () => {
        console.log('Server started on localhost:4000')
    }); 
}

main().catch((err) => {
    console.log(err); 
}); 
