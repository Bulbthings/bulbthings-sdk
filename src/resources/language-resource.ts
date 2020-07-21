import { TranslateService } from '@ngx-translate/core';
import { BulbThings } from '../';

export class LanguageResource {
    private translateService: TranslateService;
    constructor(private bulbthings: BulbThings) {}

    async translate(text: string, params?: object) {
        return this.translateService.get(text, params).toPromise();
    }
}
