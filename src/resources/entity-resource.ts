import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
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

    async getAccounts(id: string) {
        return (
            (await request(
                this.bulbthings,
                'GET',
                `${this.bulbthings.options.coreUrl}/${id}/accounts`
            )) as JSONAPI.CollectionResourceDoc
        )?.data.map((x) => parseResource({ resource: x, type: Account }));
    }

    async getPermissions(id: string) {
        return (
            (await request(
                this.bulbthings,
                'GET',
                `${this.bulbthings.options.coreUrl}/${id}/permissions`
            )) as JSONAPI.CollectionResourceDoc
        )?.data.map((x) =>
            parseResource({ resource: x, type: EntityPermission })
        );
    }
}
