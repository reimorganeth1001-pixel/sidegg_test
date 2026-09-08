import { loadConfig } from '@/utils/load';

loadConfig();

export const PORT = process.env.PORT || 7777;
export const SOCKET_PORT: number = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 8888;
