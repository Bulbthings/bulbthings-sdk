import { describe, it } from 'mocha';
import { expect } from 'chai';
import { BulbThings } from '../src';

describe('Actions', () => {
    let bulb: BulbThings;
    let actionTypeId: string;
    let actionId: string;

    before(() => {
        bulb = new BulbThings();
    });

    it('should create an action type', async () => {
        const actionType = await bulb.actionTypes.create({
            id: 'toggleEngine' + Date.now(),
            schema: {
                title: 'Toggle engine',
                description: 'Start or stop the engine',
                type: 'boolean'
            }
        });
        actionTypeId = actionType.id;
        expect(actionType.id).to.not.be.undefined;
        expect(actionType.schema['title']).to.be.equal('Toggle engine');
    });

    it('should create an action', async () => {
        const action = await bulb.actions.create({
            actionTypeId: actionTypeId,
            status: 'available',
            input: true,
            entityId: '22'
        });
        actionId = action.id;
        expect(action.id).to.not.be.undefined;
        expect(action.status).to.be.equal('available');
        expect(action.actionTypeId).to.be.equal(actionTypeId);
    });

    it('should delete an action', async () => {
        let error;
        try {
            await bulb.actions.deleteById(actionId);
        } catch (err) {
            console.error(err);
            error = err;
        }
        expect(error).to.be.undefined;
    });

    it('should delete an action type', async () => {
        let error;
        try {
            await bulb.actionTypes.deleteById(actionTypeId);
        } catch (err) {
            console.error(err);
            error = err;
        }
        expect(error).to.be.undefined;
    });
});
