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
    entityTypes = new Resource<EntityType>(this, EntityType);
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
        if (path.endsWith('bulbthings.com')) {
            this._basePath = path;
        } else {
            console.error(
                `Invalid path "${path}" must belong to bulbthings.com domain`
            );
        }
    }

    constructor(private apiToken?: string) {
        // TODO: Authentication
    }
}
