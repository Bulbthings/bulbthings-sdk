import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Membership } from './membership';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'scopes'
})
export class Scope extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    membershipId: string;

    @Attribute()
    entityId: string;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Membership)
    membership?: Membership;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
