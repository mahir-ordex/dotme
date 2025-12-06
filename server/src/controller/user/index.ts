import { quereis } from "./quereis.js";
import { types } from "./types.js";
import { resolvers, extraResolvers } from "./resolvers.js";
import { mutations } from "./mutation.js";

export const User = {
    quereis,
    types,
    mutations,
    resolvers: {
        ...resolvers,
        User: extraResolvers
    }
};