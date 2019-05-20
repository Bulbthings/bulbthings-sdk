import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Events', () => {
    let bulb: BulbThings;
    let eventId: string;

    before(() => {
        bulb = new BulbThings();
    });

    it('should fetch events', async () => {
        const events = await bulb.events.findAll({
            include: ['eventType'],
            page: { limit: 3 }
        });
        eventId = events[0].id;
        expect(events).to.be.have.lengthOf(3);
    });

    it('should fetch an event by id', async () => {
        const event = await bulb.events.findById(eventId);
        expect(event).to.have.property('id');
        expect(event.id).to.be.equal(eventId);
    });

    // it('should create an event', async () => {
    //     const event = await bulb.events.create({
    //         eventTypeId: 'overheatingEngine'
    //     });
    //     eventId = event.id;
    //     expect(event.id).to.not.be.undefined;
    // });

    // it('should delete an event', async () => {
    //     let error;
    //     try {
    //         await bulb.events.deleteById(eventId);
    //     } catch (err) {
    //         error = err;
    //     }
    //     expect(error).to.be.undefined;
    // });
});
