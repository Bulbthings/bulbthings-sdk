import 'reflect-metadata';
import EventSource from 'cross-eventsource';
import { Resource, ReadonlyResource } from './resources/resource';
import { TimeSeriesResource } from './resources/time-series';
import { UtilsResource } from './resources/utils';
import { FileResource } from './resources/file';
import {
    Entity,
    EntityType,
    AttributeType,
    Measurement,
    Association,
    AssociationType,
    Unit,
    EventType,
    Event,
    ActionType,
    Action,
    Hook,
    File
} from './models';
import { CoreEventType } from './types/core-event-type';
import { CoreEvent } from './interfaces/core-event';
import { BulbThingsOptions } from './interfaces/bulbthings-options';

// Export all models so they can be used from outside
export * from './models';

export class BulbThings {
    // Core API resources
    entities = new Resource<Entity>(this, Entity);
    entityTypes = new Resource<EntityType>(this, EntityType);
    attributeTypes = new Resource<AttributeType>(this, AttributeType);
    measurements = new Resource<Measurement>(this, Measurement);
    associations = new Resource<Association>(this, Association);
    associationTypes = new Resource<AssociationType>(this, AssociationType);
    eventTypes = new Resource<EventType>(this, EventType);
    events = new Resource<Event>(this, Event);
    actionTypes = new Resource<ActionType>(this, ActionType);
    actions = new Resource<Action>(this, Action);
    hooks = new Resource<Hook>(this, Hook);
    timeSeries = new TimeSeriesResource(this);
    units = new ReadonlyResource<Unit>(this, Unit);
    files = new FileResource<File>(this, File);
    utils = new UtilsResource(this);

    // Options
    options: BulbThingsOptions = {
        coreUrl: 'https://core-v2.bulbthings.com',
        eventsUrl: 'https://events.bulbthings.com'
    };

    private _meta: any = {};

    // Event Source interface for Server-Sent Events (SSE)
    private eventSource: EventSource;

    // Deprecated
    get basePath(): string {
        return this.options.coreUrl;
    }

    // Deprecated
    set basePath(path: string) {
        this.options.coreUrl = path;
    }

    // Deprecated
    get tenant(): string {
        return this._meta.tenant;
    }

    // Deprecated
    set tenant(tenant: string) {
        this._meta.tenant = tenant;
    }

    // Deprecated
    get meta(): any {
        return this._meta;
    }

    on(type: CoreEventType, listener: (event: CoreEvent) => void) {
        this.eventSource.addEventListener(type, evt => {
            listener(<CoreEvent>{
                type,
                data: JSON.parse(evt['data'])
            });
        });
    }

    constructor(options: BulbThingsOptions = {}) {
        // TODO: Authentication

        // Options init
        this.options = { ...this.options, ...options };

        // Connecting to server-sent events
        this.eventSource = new EventSource(`${this.options.eventsUrl}/connect`);
        this.eventSource.onerror = evt => console.error('Error!', evt);
    }
}
