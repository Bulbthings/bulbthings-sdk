import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings, Action, EventType, Event, ActionType } from '../src';

describe('Events', () => {
    let bulb: BulbThings;
    let eventType: EventType;
    let event: Event;
    let actionType: ActionType;
    let action: Action;

    before(async () => {
        bulb = new BulbThings();
        bulb.basePath = 'http://localhost:3060';

        eventType = await bulb.eventTypes.create({
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

        actionType = await bulb.actionTypes.create({
            id: 'toggleEngine' + Date.now(),
            schema: {
                title: 'Toggle engine',
                description: 'Start or stop the engine',
                type: 'boolean'
            }
        });

        action = await bulb.actions.create({
            actionTypeId: actionType.id,
            status: 'available',
            input: true,
            targetEntityId: '22'
        });
    });

    after(async () => {
        await bulb.eventTypes.deleteById(eventType.id);
        await bulb.actions.deleteById(action.id);
        await bulb.actionTypes.deleteById(actionType.id);
    });

    it('should create an event with a related action', async () => {
        event = await bulb.events.create({
            sourceEntityId: '1',
            targetEntityId: '22',
            eventTypeId: eventType.id,
            priority: 'danger',
            payload: {
                data: {
                    temperature: 100
                },
                text: `Alert: the engine is overheating!`,
                sections: [
                    {
                        type: 'text',
                        value:
                            'The engine temperature is *waaay* higher than it should be'
                    }
                ]
            },
            actions: [action]
        });
        expect(event.id).to.be.not.be.undefined;
        expect(event.eventTypeId).to.be.equal(eventType.id);
        expect(event.actions).to.be.instanceOf(Array);
        expect(event.actions).to.be.have.lengthOf(1);
        expect(event.actions[0].id).to.be.equal(action.id);
    });

    it('should delete an event', async () => {
        let error;
        try {
            await bulb.events.deleteById(event.id);
        } catch (err) {
            console.error(err);
            error = err;
        }
        expect(error).to.be.undefined;
    });
});
