import { quereis } from "./quereis.js";
import { types } from "./types.js";
import { resolvers, extraResolvers } from "./resolvers.js";

export const User = {
    quereis,
    types,
    resolvers: {
        ...resolvers,
        User: extraResolvers  // Add User type resolver
    }
};