export interface graphQLContext {
    user:JWTUser
}

export interface JWTUser {
    id:string;
    email:string;
}