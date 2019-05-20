import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Entity types', () => {
    let bulb: BulbThings;
    let entityTypeId: string;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch entity types', async () => {
        const entityTypes = await bulb.entityTypes.findAll({
            page: { limit: 3 }
        });
        entityTypeId = entityTypes[0].id;
        expect(entityTypes).to.be.have.lengthOf(3);
    });

    it('should fetch an entity type by id', async () => {
        const entityType = await bulb.entityTypes.findById(entityTypeId);
        expect(entityType).to.have.property('id');
        expect(entityType.id).to.be.equal(entityTypeId);
    });

    it('should create an entity type', async () => {
        const entityType = await bulb.entityTypes.create({
            name: 'test',
            label: 'Test',
            description: 'A description'
        });
        entityTypeId = entityType.id;
        expect(entityType.id).to.not.be.undefined;
    });

    it('should delete an entity type', async () => {
        let error;
        try {
            await bulb.entityTypes.deleteById(entityTypeId);
        } catch (err) {
            console.error(err);
            error = err;
        }
        expect(error).to.be.undefined;
    });
});
