import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Event types', () => {
    let bulb: BulbThings;
    let eventTypeId: string;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch event types', async () => {
        const eventTypes = await bulb.eventTypes.findAll({
            page: { limit: 3 }
        });
        eventTypeId = eventTypes[0].id;
        expect(eventTypes).to.be.have.lengthOf(3);
    });

    it('should fetch an event type by id', async () => {
        const eventType = await bulb.eventTypes.findById(eventTypeId);
        expect(eventType).to.have.property('id');
        expect(eventType.id).to.be.equal(eventTypeId);
    });

    it('should create an event type', async () => {
        const eventType = await bulb.eventTypes.create({
            id: `overheatingEngine${Date.now()}`,
            schema: {
                title: 'Overheating engine',
                description:
                    'The engine temperature is exceeding its normal operating range.',
                type: 'object',
                properties: {
                    temperature: {
                        type: 'number'
                    }
                },
                required: ['temperature']
            }
        });
        eventTypeId = eventType.id;
        expect(eventType.id).to.not.be.undefined;
    });

    it('should delete an event type', async () => {
        let error;
        try {
            await bulb.eventTypes.deleteById(eventTypeId);
        } catch (err) {
            error = err;
        }
        expect(error).to.be.undefined;
    });
});
