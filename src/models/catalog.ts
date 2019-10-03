import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';
import { Hook } from './hook';

@JsonApiModelConfig({
    endpoint: 'catalogs'
})
export class Catalog extends JsonApiModel {
    @Attribute()
    companyId?: string;

    @Attribute()
    label: string;

    @Attribute()
    version: string;

    @Attribute()
    description?: string;

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];

    @Relation('HasMany', () => Hook)
    hooks?: Hook[];
}
