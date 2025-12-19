import { mutations } from './mutation';
import { queries } from './queries';
import resolvers from "./resolver";
import { typeDefs } from './types';

export const Order = {
    resolvers,
    mutations,
    types: typeDefs,
    queries  
};