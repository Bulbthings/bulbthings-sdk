import { describe, it } from 'mocha';
import { expect } from 'chai';
import BulbThings from '../src';

describe('Entities', () => {
    let bulb: BulbThings;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch entities', async () => {
        const { data: entities } = await bulb.entities.findAll({
            page: { limit: 3 }
        });
        expect(entities).to.be.have.lengthOf(3);
    });
});
