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

/**
 * Cross-origin configuration for the REST API.
 *
 * Notes:
 * - This is currently permissive (`origin: '*'`) to simplify local/dev usage.
 * - If you deploy this publicly, consider restricting `origin` and headers.
 */
const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Mount the backend REST API under `/api`.
 *
 * The `router` module defines the actual resource paths (e.g. `/api/game`, etc).
 */
app.use('/api', router);

/**
 * Lightweight health/info endpoint.
 * Useful to quickly verify the HTTP server is reachable.
 */
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("sides.gg Server");
});

/**
 * Socket.IO is hosted on a separate HTTPS server instance (not the Express server).
 * This keeps the socket transport lifecycle separate from Express middleware.
 */
const server = https.createServer();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

/**
 * Low-level Socket.IO connection lifecycle hooks.
 *
 * The business event handlers are registered in `socket_router(...)` below.
 */
io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

/**
 * Register all application socket routes/events.
 *
 * `socket_router` typically attaches listeners like "chat:newMessage", "game:join", etc.
 */
io.on('connection', (socket) => {
  socket_router(socket, io);
});
// app.use("*", (req: Request, res: Response, next: NextFunction) => {
//     res.send("Invalid Api");
// });

/**
 * Periodically refreshes game/event data from upstream (ESPN).
 *
 * The interval is defined in seconds in config, so we convert to milliseconds.
 * Any errors are handled inside `utils.getAndUpdateEvents` (or logged by the caller).
 */
setInterval(utils.getAndUpdateEvents, espnConfig.FETCH_INTERVAL * 1000);

/**
 * Start both the Express HTTP server and the Socket.IO server.
 *
 * Returns a human-readable status string so startup logs are easy to spot.
 */
async function beginServing() {
  // console.log("PORT", PORT);
  app.listen(PORT);
  io.listen(SOCKET_PORT);
  // app.on("error", console.log);
  // app.on("listening", () => console.log(`Serving Express On Port: ${PORT}`));
  return "All Good";
}

beginServing().then(console.log).catch(console.error);