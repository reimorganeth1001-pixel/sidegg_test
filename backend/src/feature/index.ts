import * as espn from './espn';
import * as game from './game';
import * as team from './team';
import * as user from './user';
import * as utils from './utils';
import * as code from './code';
import * as chat from "./chat";

/**
 * Feature-layer aggregator module.
 *
 * "Features" hold business logic: orchestration, persistence calls, and integrations.
 * Controllers call into this layer; routes do not call features directly.
 */
export { espn, game, team, user, utils, code, chat };