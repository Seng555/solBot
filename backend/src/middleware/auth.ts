import { Request, Response } from "express";
import { public_path } from "../config/public_path";
const createError = require('http-errors')
import { verify } from 'jsonwebtoken'
import { config } from "../config/config";
export const auth = async (req:any, res: Response, next: any) => {
    try {
        //console.log(req.path)
        if (public_path.includes(req.path)) { // check public path 
            return next()
        }
        //check authorization
        if (!req.headers.authorization) {
            //console.log("sdasdasd")
            return next(createError(407, 'Proxy Authentication Required!'))
        }
        const decoded:any = verify(req.headers.authorization, config.private_key);
        req.auth = decoded.data;
        next()
    } catch (err:any) {
        return next(createError(498 , "Expired or otherwise invalid token"))
    }

}