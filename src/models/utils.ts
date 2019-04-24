import { JsonApiModel } from '../models/jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'utils'
})
export class Utils extends JsonApiModel {
}
