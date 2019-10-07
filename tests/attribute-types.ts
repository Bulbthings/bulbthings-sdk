import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Attribute types', () => {
    let bulb: BulbThings;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch attribute types with entity types', async () => {
        const attributeTypes = await bulb.attributeTypes.findAll({
            include: ['entityTypes']
        });

        for (const type of attributeTypes) {
            expect(type.entityTypes).to.not.be.undefined;
        }
    });
});
