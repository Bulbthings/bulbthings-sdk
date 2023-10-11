import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({ endpoint: 'entityPermissions' })
export class EntityPermission extends JsonApiModel<EntityPermission> {
    @Attribute()
    read?: boolean;

    @Attribute()
    write?: boolean;
}
