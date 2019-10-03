import { Relation } from '../decorators/relation';
import { JsonApiModel } from './jsonapi-model';
import { AssociationType } from './association-type';
import { Entity } from './entity';
import { Period } from '../interfaces/period';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { periodConverter } from '../converters/period';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'associations'
})
export class Association extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    associationTypeId: string;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute({ converter: periodConverter })
    period?: Period;

    @Attribute()
    ratio: number;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => AssociationType)
    associationType?: AssociationType;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
