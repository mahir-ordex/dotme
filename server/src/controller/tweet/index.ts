import { queries } from "./quereis.js";
import { mutations } from "./mutation.js";
import { resolvers } from "./resolver.js";
import { types } from "./types.js";

export const Tweet: Record<string, unknown> = {
    queries,
    mutations,
    resolvers,
    types
};