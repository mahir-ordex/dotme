import 'dotenv/config';
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { User } from "./controller/user/index.js";
import cors from "cors";

const app = express();

const typeDefs = `
  type Query {
    ${User.quereis}
  }
  ${User.types}
`;

const resolvers = {
  Query: {
    ...User.resolvers.Query
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(cors({
  origin:"*",
  credentials:true
}))

app.use("/graphql", express.json(), expressMiddleware(server));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running at ${port}`));
