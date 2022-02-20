import {AsyncLocalStorage} from 'async_hooks';

export const storage = new AsyncLocalStorage<{reqId: string, ip: string}>();
