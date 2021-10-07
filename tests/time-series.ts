import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Bulbthings } from '../src';
import MockDate from 'mockdate';
const nock = require('nock');

const mockTimeSeriesResponse = {
    data: [
        {
            type: 'timeSeries',
            attributes: {
                sourceEntityId: '123456',
                targetEntityId: '123456',
                time: '2019-07-09T00:00:00.000Z',
            },
            relationships: {
                targetEntity: {
                    data: {
                        type: 'targetEntities',
                        id: '123456',
                    },
                },
            },
        },
    ],
    included: [
        {
            type: 'targetEntities',
            id: '123456',
            attributes: {
                companyId: 'myCompanyId',
                entityTypeId: 'asset',
                accountId: 'myAccountId',
                quantity: '1',
                attributes: {
                    make: 'nkkl',
                    assetStatus: 'Active',
                    assetStatusDetail: 'Sold',
                    assetEntryDatetime: '2020-06-18T12:21:43.258Z',
                },
            },
        },
    ],
};

const reportObjectExpected = {
    id: undefined,
    sourceEntityId: '123456',
    targetEntityId: '123456',
    targetEntity: {
        id: '123456',
        companyId: 'myCompanyId',
        entityTypeId: 'asset',
        accountId: 'myAccountId',
        quantity: '1',
        attributes: {
            make: 'nkkl',
            assetStatus: 'Active',
            assetStatusDetail: 'Sold',
            assetEntryDatetime: '2020-06-18T12:21:43.258Z',
        },
    },
};

describe('Entities', () => {
    let bulb: Bulbthings;

    before(() => {
        bulb = new Bulbthings();
        bulb.options.coreUrl = 'http://test';
    });

    it.only('should get a basic report with date string in params', async () => {
        nock('http://test')
            .get('/timeSeries')
            .query({
                from: '2018-12-17T03:24:00.000Z',
                to: '2019-12-17T03:24:00.000Z',
                attributeTypeId: 'tco',
                alignmentMethod: 'last',
                alignmentPeriod: 'day',
                filter: 'eq(sourceEntityId,targetEntityId)',
                include: 'targetEntity',
            })
            .reply(200, mockTimeSeriesResponse);

        const data = await bulb.timeSeries.getReport({
            from: new Date('December 17, 2018 03:24:00'),
            to: new Date('December 17, 2019 03:24:00'),
            attributeTypeId: 'tco',
            alignmentMethod: 'last',
            alignmentPeriod: 'day',
            filter: 'eq(sourceEntityId,targetEntityId)',
            include: ['targetEntity'],
        });

        expect(data).to.have.length(1);
        expect(data[0]).to.deep.equal({
            ...reportObjectExpected,
            time: new Date('2019-07-09T00:00:00.000Z'),
        });
    });
    it.only('should get a basic report with SQL query in params', async () => {
        MockDate.set(new Date('July 9, 2020 13:24:00')); // mock now() value
        nock('http://test')
            .get('/timeSeries')
            .query({
                from: 'dateAdd(now(),-3,"months")',
                to: 'now()',
                attributeTypeId: 'tco',
                alignmentMethod: 'last',
                alignmentPeriod: 'day',
                filter: 'eq(sourceEntityId,targetEntityId)',
                include: 'targetEntity',
            })
            .reply(200, mockTimeSeriesResponse);

        const data = await bulb.timeSeries.getReport({
            from: 'dateAdd(now(),-3,"months")',
            to: 'now()',
            attributeTypeId: 'tco',
            alignmentMethod: 'last',
            alignmentPeriod: 'day',
            filter: `eq(sourceEntityId,targetEntityId)`,
            include: ['targetEntity'],
        });
        MockDate.reset();

        expect(data).to.have.length(1);
        expect(data[0]).to.deep.equal({
            ...reportObjectExpected,
            time: '2019-07-09T00:00:00.000Z', // TOFIX: should probably be of type Date
        });
    });
});
