import 'reflect-metadata';
import { Resource, ReadonlyResource } from './resources/resource';
import { TimeSeriesResource } from './resources/time-series';
import {
    Entity,
    EntityType,
    AttributeType,
    Measurement,
    Association,
    AssociationType,
    Unit
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
    timeSeries = new TimeSeriesResource(this);
    units = new ReadonlyResource<Unit>(this, Unit);

    private _basePath = 'https://core-v2.bulbthings.com';

    get basePath(): string {
        return this._basePath;
    }

    set basePath(path: string) {
        this._basePath = path;
    }

    constructor(private apiToken?: string) {
        // TODO: Authentication
    }
}
