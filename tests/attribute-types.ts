import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Attribute types', () => {
    let bulb: BulbThings;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch attribute types with entity types', async () => {
        const { data: attributeTypes } = await bulb.attributeTypes.findAll({
            include: ['entitytype']
        });

        for (const type of attributeTypes) {
            expect(type.entitytype).to.not.be.undefined;
            expect(type.entitytype.id).to.not.be.undefined;
        }
    });
});
