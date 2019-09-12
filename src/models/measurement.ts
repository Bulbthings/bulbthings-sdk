import { Period } from '../interfaces/period';
import { JsonApiModel } from '../models/jsonapi-model';
import { Entity } from '../models/entity';
import { Relation } from '../decorators/relation';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { periodConverter } from '../converters/period';
import { AttributeType } from './attribute-type';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'measurements'
})
export class Measurement extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    accountId: string;

    @Attribute()
    entityId: string;

    @Attribute()
    attributeTypeId: string;

    @Attribute()
    value: any;

    @Attribute()
    isAbsolute: boolean;

    @Attribute({ converter: periodConverter })
    period: Period;

    @Attribute()
    unitId: string;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => AttributeType)
    attributeType?: AttributeType;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
