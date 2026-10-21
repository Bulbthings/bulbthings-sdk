import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { Account } from '../models/account';
import { Entity } from '../models/entity';
import { EntityPermission } from '../models/entity-permission';
import { request } from '../utils/http';
import { parseResource } from '../utils/parse';
import { Resource } from './resource';

export class EntityResource extends Resource<Entity> {
    constructor(protected bulbthings: Bulbthings) {
        super(bulbthings, Entity);
    }

    /**
     * Accounts with access to the entity. You may use the `filter` option to filter the accounts
     * on `id`, `email`, `label`, `locale`, `isBot` or `isVerified`.
     */
    async getAccounts(id: string, options?: JsonApiOptions<Account>) {
        return (
            (await request(
                this.bulbthings,
                'GET',
                `${this.bulbthings.options.coreUrl}/entities/${id}/accounts`,
                { params: options }
            )) as JSONAPI.CollectionResourceDoc
        )?.data.map((x) => parseResource({ resource: x, type: Account }));
    }

    async getPermissions(id: string) {
        return (
            (await request(
                this.bulbthings,
                'GET',
                `${this.bulbthings.options.coreUrl}/entities/${id}/permissions`
            )) as JSONAPI.CollectionResourceDoc
        )?.data.map((x) =>
            parseResource({ resource: x, type: EntityPermission })
        );
    }
}
