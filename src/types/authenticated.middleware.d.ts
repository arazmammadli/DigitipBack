declare namespace Express {
    interface Request {
        user: any,
        roles:string[]
    }
}