import dotenv from 'dotenv';

import * as base from './base';
import * as sideGG_back_Config from './sideGGConfig';
import * as websocket from './websocket';

dotenv.config();

export { base, sideGG_back_Config, websocket };