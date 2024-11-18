import express, { Express, Request, Response }  from "express";
const router = express.Router();
import createError from 'http-errors';
/* GET home page. */
router.get('/', async function(req: Request, res: Response, next:any) {
    setImmediate(() => {
        try {
            res.status(200).json({
                status: true,
                mss: "Hello, world",
                data: {}
            })
        } catch (e) {
          return next(createError(500, 'Internal Server Error'))
        }
      })
});

export default router;
