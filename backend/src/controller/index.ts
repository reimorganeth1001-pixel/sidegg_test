import * as gameController from './gameController';
import * as userController from './userController';
import * as codeController from './codeController';
import * as chatController from "./chatController";

/**
 * Controller aggregator module.
 *
 * Controllers are responsible for request/transport concerns (Express or Socket.IO):
 * validating inputs, translating them into feature-layer calls, and formatting outputs.
 */
export { gameController, userController, codeController, chatController };