import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { JsonSchema } from '../interfaces/json-schema';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'settingTypes',
})
export class SettingType extends JsonApiModel<SettingType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    meta?: {
        /**
         * Whether or not this setting should be hidden from end users.
         */
        isSystem?: boolean;
    };
}
