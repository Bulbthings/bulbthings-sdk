import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'environments',
})
export class Environment extends JsonApiModel<Environment> {
    @Attribute()
    config: {
        androidAppUrl?: string;
        emailFromAddress?: string;
        emailTemplate?: string;
        favicon16?: string;
        favicon32?: string;
        faviconAppleTouch?: string;
        faviconIco?: string;
        faviconSafariPinnedTab?: string;
        features?: string[];
        iosAppUrl?: string;
        logo: string;
        longTitle?: string;
        masterAccountAvatar?: string;
        masterAccountLabel?: string;
        mobileBrowserDisclaimer?: {
            content?: string;
            title?: string;
        };
        primaryColor: string;
        primaryColorVariant?: string;
        registrationInviteEmail?: {
            button?: string;
            content?: string;
            subtitle?: string;
            title?: string;
        };
        secondaryColor?: string;
        secondaryColorVariant?: string;
        title: string;
        webmanifest?: string;
        webUrl: string;
        helpMenuOptions?: {
            supportEmail?: string;
            hasChatSupport?: boolean;
            tutorialLink?: string;
        };
    };
}
