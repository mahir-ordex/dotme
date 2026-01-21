import 'dotenv/config';
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { User } from "./controller/user/index.js";
import { Tweet } from './controller/tweet/index.js';
import cors from "cors";
import JwtServices from "./utils/jwtServices.js"
import { prisma } from './utils/prismaClient.js';
import cookieParser from 'cookie-parser';
import { connectWithRedis } from './utils/redisClient.js';
import { Order } from './controller/order/index.js';

async function startServer() {
  const app = express();
  // Import upload router
  const uploadRouter = (await import('./controller/upload/index.js')).default;

  const typeDefs = `#graphql
    type Query {
      ${User.quereis}
      ${Tweet.queries}
      ${Order.queries}
    }
    
    type Mutation {
      ${Tweet.mutations}
      ${User.mutations}
      ${Order.mutations}
    } 
    ${User.types}
    ${Tweet.types}
    ${Order.types}
  `;

  const resolvers = {
    Query: {
      ...User.resolvers.Query,
      ...(Tweet.resolvers as any).Query,

    },
    Mutation: {
      ...(Tweet.resolvers as any).Mutation,
      ...(User.resolvers as any).Mutation,
      ...(Order.resolvers)

    },
    User: {
      ...User.resolvers.User
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  });

  await server.start();

  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000'
      ].filter(Boolean) as string[];

      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json());

  // Register upload REST endpoint
  app.use('/api/upload', uploadRouter);

  app.use("/graphql", express.json(), expressMiddleware(server, {
    context: async ({ req, res }) => {
      // Check Authorization header first
      const authHeader = req.headers.authorization;
      let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      // If no Authorization header, check cookies
      if (!token && req.cookies?.token) {
        token = req.cookies.token;
      }

      if (token) {
        try {
          const userPayload = await JwtServices.decodeToken(token);
          if (userPayload && typeof userPayload !== 'string' && userPayload.id) {
            const user = await prisma.user.findUnique({
              where: { id: userPayload.id }
            });
            // console.log('Context user:', user);
            return { user, req, res };
          }
        } catch (error: any) {
          console.log('Token decode failed:', error.message);
        }
      }
      return { req, res };
    }
  }));

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`)
    connectWithRedis()
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});
