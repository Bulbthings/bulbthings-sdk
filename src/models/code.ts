import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'codes'
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
    company?: Company;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
