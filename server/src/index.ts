import 'dotenv/config';
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { User } from "./controller/user/index.js";
import { Tweet } from './controller/tweet/index.js';
import cors from "cors";
import JwtServices from "./utils/jwtServices.js"
import { prisma } from './utils/prismaClient.js';

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
  origin: "*",
  credentials: true
}));

app.use("/graphql", express.json(), expressMiddleware(server, {
  context: async ({ req }) => {
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
          return { user };
        }
      } catch (error: any) {
        console.log('Token decode failed:', error.message);
      }
    }
    return {};
  }
}));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}/graphql`));
