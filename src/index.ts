import 'reflect-metadata';
import { Resource, ReadonlyResource } from './resources/resource';
import {
    Entity,
    EntityType,
    AttributeType,
    Measurement,
    Association,
    AssociationType,
    // TimeSeries,
    Unit
} from './models';

export default class BulbThings {
    entities = new Resource<Entity>(this, Entity);
    entityType = new Resource<EntityType>(this, EntityType);
    attributeTypes = new Resource<AttributeType>(this, AttributeType);
    measurements = new Resource<Measurement>(this, Measurement);
    associations = new Resource<Association>(this, Association);
    associationTypes = new Resource<AssociationType>(this, AssociationType);
    // TODO: custom options for timeSeries
    // timeSeries = new ReadonlyCollection<TimeSeries>(TimeSeries);
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
