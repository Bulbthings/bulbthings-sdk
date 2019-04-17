import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Entities', () => {
    let bulb: BulbThings;
    let entityId: string;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch entities', async () => {
        const { data: entities } = await bulb.entities.findAll({
            page: { limit: 3 }
        });
        entityId = entities[0].id;
        expect(entities).to.be.have.lengthOf(3);
    });

    it('should fetch an entity by id', async () => {
        const entity = await bulb.entities.findById(entityId);
        expect(entity).to.have.property('id');
        expect(entity.id).to.be.equal(entityId);
    });

    it('should create an entity', async () => {
        const entity = await bulb.entities.create({
            entityTypeId: '1'
        });
        entityId = entity.id;
        expect(entity.id).to.not.be.undefined;
    });

    it('should delete an entity', async () => {
        let error;
        try {
            await bulb.entities.deleteById(entityId);
        } catch (err) {
            error = err;
        }
        expect(error).to.be.undefined;
    });
});
