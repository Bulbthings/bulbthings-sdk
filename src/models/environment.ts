import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'environments',
})
export class Environment extends JsonApiModel<Environment> {
    @Attribute()
    config: {
        favicon16?: string;
        favicon32?: string;
        faviconAppleTouch?: string;
        faviconIco?: string;
        faviconSafariPinnedTab?: string;
        longTitle?: string;
        masterAccountAvatar?: string;
        masterAccountLabel?: string;
        primaryColor: string;
        title: string;
        webmanifest?: string;
    };
}
