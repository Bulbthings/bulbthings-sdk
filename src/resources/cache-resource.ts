import { Mutex } from 'async-mutex';

export class CacheResource {
    private mutexes: { [id: string]: Mutex } = {};
    private cached: { [endpoint: string]: { [id: string]: any } } = {};

    getMutex(mutexId: string) {
        this.mutexes[mutexId] = this.mutexes[mutexId] || new Mutex();
        return this.mutexes[mutexId];
    }

    get(endpoint: string, id: string) {
        return this.cached[endpoint]?.[id];
    }

    set(endpoint: string, id: string, resource: any) {
        this.cached[endpoint] = this.cached[endpoint] ?? {};
        this.cached[endpoint][id] = resource;
    }

    clear() {
        this.cached = {};
    }
}
