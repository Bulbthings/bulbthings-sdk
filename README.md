# Bulbthings SDK

## 🚧 Documentation 🚧

(Work in progress) See full documentation [here](https://api.bulbthings.com)

## Installation

### package.json

In `dependencies`, put `"bulbthings-sdk": "https://cb76b2588e677ad6f2a2010a610f2dffd534f609@github.com/Bulbthings/bulbthings-sdk.git#{RELEASE}",` where `{RELEASE}` should be found in the [releases page](https://github.com/Bulbthings/bulbthings-sdk/releases).

### TODO: npm package

## Usage

```typescript
import { BulbThings } from 'bulbthings-sdk';

const bulbthings = new BulbThings({ apiToken: '83945b4eaf...7a37a' });

// Authentication can also be overridden per request
bulbthings.entities.findAll({ apiToken: '83945b4eaf...7a37a' });
```

## Resource

### Find all

```typescript
const entities = await bulbthings.entities.findAll({
    filter: `and(
        gt(attributes.mileage.km, 10000),
        ne(attributes.license, null)
    )`,
    include: ['entityType'],
    page: { limit: 3 },
});

// Or with pagination metadata
const { data: entities, meta } = await bulbthings.entities.findAll(
    { page: { limit: 3 } },
    true
);
```

### Find by identifier

```typescript
const entity = await bulbthings.entities.findById('31845...c8ad6e', {
    include: ['entityType'],
});
```

### Create

```typescript
const measurement = await bulbthings.measurements.create({
    entityId: entity.id,
    attributeTypeId: 'mileage',
    value: 42000,
    period: {
        from: new Date(),
        to: new Date(),
    },
    unitId: 'km',
});
```

### Update

```typescript
const updatedMeasurement = await bulbthings.measurements.update(
    measurement.id,
    {
        value: 43000,
    }
);
```

### Delete

```typescript
await bulbthings.entities.deleteById(entity.id);
```

## Time Series

### Get a report

#### Options

```typescript
export interface TimeSeriesOptions extends Omit<JsonApiOptions, 'page'> {
    from: Date;
    to: Date;
    attributeTypeId: string;
    alignmentPeriod:
        | 'second'
        | 'minute'
        | 'hour'
        | 'day'
        | 'week'
        | 'month'
        | 'quarter'
        | 'year';
    alignmentMethod: 'first' | 'last' | 'count' | 'sum' | 'avg' | 'min' | 'max';
    sourceFilter?: string;
    targetFilter?: string;
    unitCode?: string;
}
```

#### Explanation

Let's take as an example a fictional number attribute with a 1-week period. Here are the different steps happening when generating a report:

##### Step 0: raw data

```
            Week 1   Week 2   Week 3    Week 4
Entity 1         0      100       50         0
Entity 2        50       50       10         0
```

##### Step 1: Resampling

During this step, the `alignmentPeriod` and `alignmentMethod` are used to resample the data for each entity and change the period by aggregating the values.

For example, with `alignmentPeriod=month` and `alignmentMethod=sum` we get:

```
            Month 1
Entity 1        150
Entity 2        110
```

##### Step 2: Aggregating

In this step, `reducerMethod` will be used to aggregate all the series into one. For example, with `reducerMethod=avg` the final result is:

```
            Month 1
Average         130
```

#### Other examples

Example: Get the drivers ranked according to their average driver score during the last week:

```typescript
const data = await bulbthings.timeSeries.getReport({
    from: moment().subtract(1, 'week').toDate(),
    to: new Date(),
    attributeTypeId: `${driverScoreAttributeTypeId}`,
    alignmentPeriod: 'week',
    alignmentMethod: 'avg',
    fields: {
        timeSeries: ['time', 'as(value,"avgScore")'],
    },
    sort: ['-value'],
    include: ['targetEntity'],
});

const driversWithScore = data.map((d) => ({
    driver: d.targetEntity,
    avgScore,
}));
```

## Events

Every creation, modification or deletion of resources will trigger system events (not to be confused with the actual `events` _resource_) that you can receive and react to in real-time using the SDK.

### Example usage

```typescript
// Event types follow the format: [resource][Created|Updated|Deleted]
const eventType = 'entityCreated';

bulbthings.on(eventType, (event) => {
    // `data.resource` contains the resource described by the event
    // In case of an update event, `data.previousData` contains
    // the values of updated properties before the change
    const entity = event.data.resource as Entity;
});
```

### Testing

We are using nock to mock the requests response.
You need to run `npm test` to check that all the tests are passing.
To see the debug from nock, use `DEBUG=nock.* npm test`.
