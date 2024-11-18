import express, { Express, Request, Response }  from "express";
const router = express.Router();
import { sign } from 'jsonwebtoken'
import createError from 'http-errors';
import bcrypt from "bcrypt";
import { config } from "../config/config";
/* GET home page. */
router.get('/', async function(req: any, res: Response, next:any) {
        try {
                res.status(200).json({
                status:200,
                mss: "Hello, world",
                data: req.auth
            })
        } catch (e) {
            return next(createError(401, 'Unauthorized!'))
        }
});

router.post('/login', async function(req: Request, res: Response, next:any) {
        try {
            const {username, password} = req.body;
            if(!(username && password)){
                return next(createError(411, 'LengthRequired!'))
            }
            const pass = await bcrypt.hash(password, 10);
            const token = sign({
                data:{
                    username: username,
                    password: pass
                }
            }, config.private_key, { expiresIn: 60 });

            res.status(200).json({
                status: 200,
                mss: "Hello, world",
                data: {username, token}
            })
        } catch (e) {
             return next(createError(401, 'Unauthorized!'))
        }
});

export default router;
