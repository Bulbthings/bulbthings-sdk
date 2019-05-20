# BulbThings JavaScript SDK

## 🚧 Documentation 🚧

(Work in progress) See full documentation [here](https://core-v2.bulbthings.com)

## Installation

### package.json

In `dependencies`, put `"bulbthings-javascript-sdk": "https://cb76b2588e677ad6f2a2010a610f2dffd534f609@github.com/Bulbthings/bulbthings-javascript-sdk.git#{RELEASE}",` where `{RELEASE}` should be found in the [releases page](https://github.com/Bulbthings/bulbthings-javascript-sdk/releases).

### TODO: npm package

## Usage

```typescript
import { BulbThings } from 'bulbthings-javascript-sdk';
const bulbthings = new BulbThings();
```

## Resource

### Find all

```typescript
const entities = await bulbthings.entities.findAll({
    filter: `and(
        gt(attributes.mileage.km, 10000),
        ne(attributes.license, null)
    )`,
    include: ['entitytype'],
    page: { limit: 3 }
});

// Or with metadata
const { data: entities, meta } = await bulbthings.entities.findAll(
    { page: { limit: 3 } },
    true
);
```

### Find by identifier

```typescript
const entity = await bulbthings.entities.findById('1', {
    include: ['entitytype']
});
```

### Create

```typescript
const created = await bulbthings.measurements.create({
    targetEntityId: entity.id,
    attributeTypeId: '70',
    value: 'test',
    period: {
        from: new Date(),
        to: new Date()
    },
    unitId: '102'
});
```

### TODO: Refresh

```typescript
await created.refresh({
    include: ['targetEntity']
});
```

### Update

```typescript
const updated = await bulbthings.measurements.update(created.id, {
    value: 'edited'
});
// (TODO) Shortcut method:
created.value = 'edited';
await created.save();
```

### Delete

```typescript
await bulbthings.entities.deleteById(entity.id);
// Shortcut method:
await entity.delete();
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

#### Examples

Example: Get the drivers ranked according to their average driver score during the last week:

```typescript
const data = await bulbthings.timeSeries.getReport({
    from: moment()
        .subtract(1, 'week')
        .toDate(),
    to: new Date(),
    attributeTypeId: `${driverScoreAttributeTypeId}`,
    alignmentPeriod: 'week',
    alignmentMethod: 'avg',
    fields: {
        timeSeries: ['time', 'as(value,"avgScore")']
    },
    sort: ['-value'],
    include: ['targetEntity']
});

const driversWithScore = data.map(d => ({ driver: d.targetEntity, avgScore }));
```
