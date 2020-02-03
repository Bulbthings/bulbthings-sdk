import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { Catalog } from './catalog';
import { EntityType } from './entity-type';

@JsonApiModelConfig({
    endpoint: 'catalogMappings'
})
export class CatalogMapping extends JsonApiModel<CatalogMapping> {
    @Attribute()
    companyId?: string;

    @Attribute()
    catalogId: string;

    @Attribute()
    entityTypeId: string;

    @Relation('BelongsTo', () => Catalog)
    catalog?: Catalog;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;
}
