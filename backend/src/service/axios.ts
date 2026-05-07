import axios from 'axios';
import https from 'https';

import { espnConfig } from '../config';

/**
 * Preconfigured Axios instance for talking to the ESPN API.
 *
 * - `baseURL` is driven by `ESPN_SERVER` in config/env.
 * - TLS verification is disabled to support self-signed certs in some environments.
 *   If you control the endpoint, prefer enabling verification in production.
 */
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
