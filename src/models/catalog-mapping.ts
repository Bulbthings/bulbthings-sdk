import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Catalog } from './catalog';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'catalogMappings',
})
export class CatalogMapping extends JsonApiModel<CatalogMapping> {
    @Attribute()
    companyId?: string;

    @Attribute()
    catalogId: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    meta?: {
        isReadOnly?: boolean;
    };

    @Relation('BelongsTo', () => Catalog)
    catalog?: Include<Catalog>;

    @Relation('BelongsTo', () => EntityType)
    entityType?: Include<EntityType>;
}
