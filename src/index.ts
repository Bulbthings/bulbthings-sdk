import 'reflect-metadata';
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
    private _meta: any = {};

    get basePath(): string {
        return this._basePath;
    }

    set basePath(path: string) {
        this._basePath = path;
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

    constructor(private apiToken?: string) {
        // TODO: Authentication
    }
}
