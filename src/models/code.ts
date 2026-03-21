import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'codes',
})
export class Code extends JsonApiModel<Code> {
    @Attribute()
    companyId?: string;

    @Attribute()
    entityId: string;

    @Attribute()
    type: string;

    @Attribute()
    value: string;

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;
}
