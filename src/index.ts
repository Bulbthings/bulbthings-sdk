import 'reflect-metadata';
import EventSource from 'eventsource';
import { Resource, ReadonlyResource } from './resources/resource';
import { TimeSeriesResource } from './resources/time-series';
import { UtilsResource } from './resources/utils';
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
    Hook
} from './models';
import { CoreEventType } from './types/core-event-type';
import { CoreEvent } from './interfaces/core-event';

// Export all models so they can be used from outside
export * from './models';

export class BulbThings {
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
    utils = new UtilsResource(this);

    private _basePath = 'https://core-v2.bulbthings.com';
    private _eventSourcePath = 'https://events.bulbthings.com';
    private _meta: any = {};
    private eventSource: EventSource;

    get basePath(): string {
        return this._basePath;
    }

    set basePath(path: string) {
        this._basePath = path;
    }

    get eventSourcePath(): string {
        return this._eventSourcePath;
    }

    set eventSourcePath(path: string) {
        this._eventSourcePath = path;
    }

    get tenant(): string {
        return this._meta.tenant;
    }

    set tenant(tenant: string) {
        this._meta.tenant = tenant;
    }

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

    constructor(private apiToken?: string) {
        // TODO: Authentication

        // Connecting to server-sent events
        this.eventSource = new EventSource(`${this._eventSourcePath}/connect`);
        this.eventSource.onerror = evt => console.error('Error!', evt);
    }
}
