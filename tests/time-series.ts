import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Entities', () => {
    let bulb: BulbThings;

    before(() => {
        bulb = new BulbThings();
    });

    // TODO:
    it('should get a basic report', async () => {
        const data = await bulb.timeSeries.getReport({
            from: new Date(),
            to: new Date(),
            attributeTypeId: '36',
            alignmentMethod: 'last',
            alignmentPeriod: 'day',
            filter: `eq(sourceEntityId,targetEntityId)`,
            include: ['targetEntity']
        });
        expect(data).to.have.length.of.at.least(1);
        expect(data.every(d => d.targetEntity.id !== undefined)).to.be.true;
    });
});
