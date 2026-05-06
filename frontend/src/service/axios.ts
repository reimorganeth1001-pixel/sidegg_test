import axios from 'axios';
import https from 'https';

import { sideGG_back_Config } from '../config';

export const sideGGServer = axios.create({
  baseURL: sideGG_back_Config.SIDEGG_SERVER,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});