import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'catalogs',
})
export class Catalog extends JsonApiModel<Catalog> {
    @Attribute()
    companyId?: string;

    @Attribute()
    label: string;

    @Attribute()
    description?: string;

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];
}
