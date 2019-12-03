import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { JsonSchema } from '../interfaces/json-schema';

@JsonApiModelConfig({
    endpoint: 'settingTypes'
})
export class SettingType extends JsonApiModel<SettingType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;
}
