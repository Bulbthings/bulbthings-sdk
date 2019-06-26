import { request } from '../utils/http';
import { BulbThings } from '..';

export class UtilsResource {
    constructor(private bulbthings: BulbThings) {}

    async deleteTenant(id: string): Promise<void> {
        await request(
            'DELETE',
            `${this.bulbthings.options.coreUrl}/utils/${id}`,
            {
                meta: this.bulbthings.meta
            }
        );
    }
}
