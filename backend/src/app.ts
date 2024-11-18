import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/config';

// Middleware import
import { auth } from './middleware/auth';

// Router imports
import index from './routes/index';
import user from './routes/user';
import { socketSetup } from './socket/socket';

const PORT = config.port || 3000;
const app: Express = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


(async () => {
  // Middleware
  app.use(auth);

  // Use routers
  app.use('/', index);
  app.use('/user', user);

  // Catch 404 and forward to error handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      mss: '404, Not found!',
      data: {},
    });
  });

  // Error handler
  app.use((err: any, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).json({
      status: err.status,
      mss: `${err.status}, ${err.message}`,
      data: {},
    });
  });
  const server = app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))
  socketSetup(server)
  // Try to connect 
  // getLatestBlock()
})();
