import { JsonApiModel } from '../models/jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';
import { Account } from './account';
import { AttributeType } from './attribute-type';
import { Unit } from './unit';

@JsonApiModelConfig({
    endpoint: 'unitSettings'
})
export class UnitSetting extends JsonApiModel<UnitSetting> {
    @Attribute()
    companyId?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    attributeTypeId: string;

    @Attribute()
    unitId: string;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => AttributeType)
    attributeType?: AttributeType;

    @Relation('BelongsTo', () => Unit)
    unit?: Unit;
}
