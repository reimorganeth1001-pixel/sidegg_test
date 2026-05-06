import axios from 'axios';
import https from 'https';

import { espnConfig } from '../config';

export const espnServer = axios.create({
  baseURL: espnConfig.ESPN_SERVER,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// export const jupiterServer = axios.create({
//   baseURL: process.env.JUPITER_SERVER_URL,
//   auth: {
//     username: process.env.JUPITER_USERNAME ?? 'Jupiter Server Username',
//     password: process.env.JUPITER_PASSWORD ?? 'Jupiter Server Password',
//   },
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false,
//   }),
// });
