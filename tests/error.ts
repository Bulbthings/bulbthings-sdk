import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Errors', () => {
    let bulb: BulbThings;
    let entityId: string;

    before(() => {
        bulb = new BulbThings();
        bulb.basePath = 'http://localhost:3060';
    });

    it('should throw an error when an "Not Found" API error is returned', async () => {
        try {
            await bulb.entities.findById('9999999999999999');
        } catch (err) {
            expect(err.errors).to.be.instanceOf(Array);
            expect(err.errors).to.have.lengthOf(1);
            expect(err.errors[0].status).to.be.equal('404');
            expect(err.errors[0].title).to.be.equal('NotFoundError');
        }
    });
});
