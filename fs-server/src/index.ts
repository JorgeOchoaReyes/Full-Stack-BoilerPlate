import "reflect-metadata"; 
import 'dotenv-safe/config';
import {COOKIE_NAME, __prod__} from "./constants";
import express from "express";
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {PostResolver} from './resolvers/post'; 
import {HelloResolver} from './resolvers/hello'; 
import {UserResolver} from './resolvers/user'; 
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors'; 
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { mydataSource } from "./dataSource";
require('dotenv-safe').config();


//current user made: 
//username: reye@reye
//password: qweasd

const main = async () => {
        
    let connection = await mydataSource.initialize();

    //migrations can be created using npx typeorm migration:create __name___
    connection.runMigrations();
   
    //Deletes all of a specific entity 


    const app = express(); //start express server
    // app.set('trust proxy', process.env.NODE_ENV !== 'production'); //set deafult headers on apollo server website to => header key: x-forwarded-proto, value: https 

    let RedisStore = connectRedis(session);//for redis 
    let redisClient = new Redis(process.env.REDIS_URL); 
    app.set("proxy", 1);

    app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}));
 
    
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
                secure: __prod__,
                domain: __prod__ ? '.3sides.xyz' : undefined                
            },
            resave: false,
            secret: process.env.SESSION_SECRET, 
            saveUninitialized: false
        })     
    );
 
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        plugins: [
            process.env.NODE_ENV === 'production'
              ? ApolloServerPluginLandingPageDisabled()
              : ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
        context: ({req, res})=>({req , res, redisClient}) //this context can be used everywhere in the resolvers for exmaple see forgotpassword token storage
    }) //set up graphql with apollo server, context is used to pass it the orm db 


//http://localhost:4000/graphql
//https://studio.apollographql.com
//http://localhost:3000

   
    await apolloServer.start(); // start server



    apolloServer.applyMiddleware({app, cors: false}); // initiate graphql 


    app.listen(parseInt(process.env.PORT), () => {
        console.log('Server started on localhost:' + process.env.PORT)
    }); 
}

main().catch((err) => {
    console.log(err); 
}); 

