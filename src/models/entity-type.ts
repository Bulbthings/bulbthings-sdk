import { JsonApiModel } from './jsonapi-model';
import { HasMany } from '../decorators/has-many';
import { AttributeType } from './attribute-type';
import { JsonApiModelConfig } from '../decorators/json-api-model-config';

@JsonApiModelConfig({
    endpoint: 'entitytypes'
})
export class EntityType extends JsonApiModel {
    // @Attribute()
    parentId: string;

    // @Attribute()
    path: string[];

    // @Attribute()
    name: string;

    // @Attribute()
    label: string;

    // @Attribute()
    description: string;

    @HasMany(AttributeType)
    attributetypes: AttributeType[];
}
