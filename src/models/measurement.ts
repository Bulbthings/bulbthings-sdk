import { periodConverter } from '../converters/period';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Period } from '../interfaces/period';
import { Entity } from '../models/entity';
import { JsonApiModel } from '../models/jsonapi-model';
import { Include } from '../types/include';
import { Account } from './account';
import { AttributeType } from './attribute-type';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'measurements',
})
export class Measurement extends JsonApiModel<Measurement> {
    @Attribute()
    companyId?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    entityId: string;

    @Attribute()
    attributeTypeId: string;

    @Attribute()
    value: any;

    @Attribute()
    isAbsolute?: boolean;

    @Attribute({ converter: periodConverter })
    period?: Period;

    @Attribute()
    unitId?: string;

    @Attribute()
    createdAt?: Date;

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => AttributeType)
    attributeType?: Include<AttributeType>;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;
}
