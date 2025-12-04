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

const app = express();

const typeDefs = `#graphql
  type Query {
    ${User.quereis}
    ${Tweet.queries}
  }
  
  type Mutation {
    ${Tweet.mutations}
  } 
  ${User.types}
  ${Tweet.types}
`;

const resolvers = {
  Query: {
    ...User.resolvers.Query,
    ...(Tweet.resolvers as any).Query
  },
  Mutation: {
    ...(Tweet.resolvers as any).Mutation
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
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Origin:', req.get('origin'));
  console.log('Cookies:', req.cookies);
  next();
});


app.use(cookieParser());
app.use(express.json());

app.use("/graphql", express.json(), expressMiddleware(server, {
  context: async ({ req, res}) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (token) {
      try {
        const userPayload = await JwtServices.decodeToken(token);
        if (userPayload && typeof userPayload !== 'string' && userPayload.id) {
          const user = await prisma.user.findUnique({ 
            where: { id: userPayload.id }
          });
          console.log('Context user:', user);
          return { user, req, res }; // Remove the types, pass actual objects
        }
      } catch (error: any) {
        console.log('Token decode failed:', error.message);
      }
    }
    return { req, res }; // Always return req and res
  }
}));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}/graphql`));
