import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from '@weirdorg/dotenv';
import express, {
  NextFunction,
  Request,
  Response,
} from 'express';
import https from 'https';
import { Server } from 'socket.io';

import {
  base,
  espnConfig,
} from '@/config';
import router from '@/routes';
import { socket_router } from '@/socket_route';

import { utils } from './feature';

dotenv.config();

const PORT = base.PORT;
const SOCKET_PORT: number= base.SOCKET_PORT;

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("sides.gg Server");
});

const server = https.createServer();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

io.on('connection', (socket) => {
  socket_router(socket, io);
});
// app.use("*", (req: Request, res: Response, next: NextFunction) => {
//     res.send("Invalid Api");
// });

setInterval(utils.getAndUpdateEvents, espnConfig.FETCH_INTERVAL * 1000);

async function beginServing() {
  // console.log("PORT", PORT);
  app.listen(PORT);
  io.listen(SOCKET_PORT);
  // app.on("error", console.log);
  // app.on("listening", () => console.log(`Serving Express On Port: ${PORT}`));
  return "All Good";
}

beginServing().then(console.log).catch(console.error);