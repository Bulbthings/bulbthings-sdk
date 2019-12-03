import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { SettingType } from './setting-type';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'settings'
})
export class Setting extends JsonApiModel<Setting> {
    @Attribute()
    companyId?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    settingTypeId: string;

    @Attribute()
    value: any;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => SettingType)
    settingType?: SettingType;
}
