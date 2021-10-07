import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Bulbthings } from '../src';

describe('Attribute types', () => {
    let bulb: Bulbthings;

    before(() => {
        bulb = new Bulbthings();
    });

    it('should fetch attribute types with entity types', async () => {
        const attributeTypes = await bulb.attributeTypes.findAll({
            include: ['entityTypes'],
        });

        for (const type of attributeTypes) {
            expect(type.entityTypes).to.not.be.undefined;
        }
    });
});
