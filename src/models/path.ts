import { Relation } from '../decorators/relation';
import { JsonApiModel } from './jsonapi-model';
import { Entity } from './entity';
import { Period } from '../interfaces/period';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'paths',
})
export class Path extends JsonApiModel<Path> {
    @Attribute()
    companyId?: string;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    period?: Period;

    @Attribute()
    ratio?: number;

    @Attribute()
    quantity?: number;

    @Attribute()
    nodes?: string[];

    @Attribute()
    edges?: string[];

    @Attribute()
    depth?: number;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
